// MyPlot by 7Ai — shared site behavior
// Form submissions go directly to Supabase. Each form declares which table
// it writes to via data-supabase-table="...". See myplot_schema.sql.
//
// The anon key below is safe to expose publicly. Row Level Security on the
// database allows INSERT only for anonymous visitors, never SELECT, so
// nobody can read submissions back through this key. Once a referrer logs
// in, MyPlotAuth.authedFetch below uses THEIR OWN session token instead of
// this key, which is what lets them see their own dashboard data under the
// "authenticated" RLS policies, and nothing belonging to anyone else.

var SUPABASE_URL = "https://krxsfjzcvhvatplrttmf.supabase.co";
var SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtyeHNmanpjdmh2YXRwbHJ0dG1mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkwNjk1MjMsImV4cCI6MjEwNDY0NTUyM30.H_rojfXJhOJHrMrL6vbr46meh27kpeoqE-7N5mSQGts";

// Shared auth helpers, used by the Refer & Earn signup form here, and by
// the login and dashboard pages in their own page scripts. Session is kept
// in localStorage so it survives navigating from login to the dashboard.
window.MyPlotAuth = {
  signUp: function (email, password, metadata) {
    return fetch(SUPABASE_URL + "/auth/v1/signup", {
      method: "POST",
      headers: { apikey: SUPABASE_ANON_KEY, "Content-Type": "application/json" },
      body: JSON.stringify({ email: email, password: password, data: metadata || {} }),
    }).then(function (response) {
      return response.json().then(function (body) {
        if (!response.ok) throw body;
        return body;
      });
    });
  },

  signIn: function (email, password) {
    return fetch(SUPABASE_URL + "/auth/v1/token?grant_type=password", {
      method: "POST",
      headers: { apikey: SUPABASE_ANON_KEY, "Content-Type": "application/json" },
      body: JSON.stringify({ email: email, password: password }),
    }).then(function (response) {
      return response.json().then(function (body) {
        if (!response.ok) throw body;
        localStorage.setItem("myplot_session", JSON.stringify(body));
        return body;
      });
    });
  },

  getSession: function () {
    var raw = localStorage.getItem("myplot_session");
    return raw ? JSON.parse(raw) : null;
  },

  signOut: function () {
    localStorage.removeItem("myplot_session");
  },

  // Authenticated request to the REST API using the logged-in referrer's
  // own token, so Row Level Security applies their "authenticated" access,
  // their own profile, their own referred inquiries, nothing else.
  authedFetch: function (path, options) {
    var session = this.getSession();
    if (!session) return Promise.reject({ message: "Not logged in" });
    options = options || {};
    options.headers = options.headers || {};
    options.headers.apikey = SUPABASE_ANON_KEY;
    options.headers.Authorization = "Bearer " + session.access_token;
    options.headers["Content-Type"] = "application/json";
    return fetch(SUPABASE_URL + path, options).then(function (response) {
      if (response.status === 204) return null;
      return response.json().then(function (body) {
        if (!response.ok) throw body;
        return body;
      });
    });
  },
};

document.addEventListener("DOMContentLoaded", function () {

  // ---- Referrer signup (Refer & Earn page) ----
  // This is a real account, not a simple table row, so it is handled
  // separately from the generic data-supabase-table forms below: create
  // the Supabase Auth account first, carrying name/phone/payout details as
  // user metadata, then the login page creates the linked referrers row
  // (with its auto-generated code) the first time this person logs in.
  var signupForm = document.querySelector("form[data-referrer-signup]");
  if (signupForm) {
    var suSuccess = signupForm.querySelector(".form-success");
    var suError = signupForm.querySelector(".form-error");
    var suSubmit = signupForm.querySelector(".form-submit");
    var suDefaultError = suError ? suError.textContent : "";

    signupForm.addEventListener("submit", function (e) {
      e.preventDefault();

      var name = signupForm.querySelector('[name="name"]').value.trim();
      var phone = signupForm.querySelector('[name="phone"]').value.trim();
      var email = signupForm.querySelector('[name="email"]').value.trim();
      var password = signupForm.querySelector('[name="password"]').value;
      var passwordConfirm = signupForm.querySelector('[name="password_confirm"]').value;
      var bankAccountName = signupForm.querySelector('[name="bank_account_name"]').value.trim();
      var bankAccountNumber = signupForm.querySelector('[name="bank_account_number"]').value.trim();
      var bankName = signupForm.querySelector('[name="bank_name"]').value.trim();

      if (suSuccess) suSuccess.style.display = "none";
      if (suError) {
        suError.style.display = "none";
        suError.textContent = suDefaultError;
      }

      if (password !== passwordConfirm) {
        if (suError) {
          suError.textContent = "Passwords do not match.";
          suError.style.display = "block";
        }
        return;
      }
      if (password.length < 8) {
        if (suError) {
          suError.textContent = "Password must be at least 8 characters.";
          suError.style.display = "block";
        }
        return;
      }

      var originalLabel = suSubmit ? suSubmit.textContent : "";
      if (suSubmit) {
        suSubmit.disabled = true;
        suSubmit.textContent = "Creating account...";
      }

      window.MyPlotAuth.signUp(email, password, {
        name: name,
        phone: phone,
        bank_account_name: bankAccountName || null,
        bank_account_number: bankAccountNumber || null,
        bank_name: bankName || null,
      })
        .then(function () {
          signupForm.reset();
          if (suSuccess) suSuccess.style.display = "block";
        })
        .catch(function (err) {
          var message = suDefaultError;
          if (err && err.msg && /already registered/i.test(err.msg)) {
            message = "An account already exists with that email. Try logging in instead.";
          }
          if (suError) {
            suError.textContent = message;
            suError.style.display = "block";
          }
        })
        .finally(function () {
          if (suSubmit) {
            suSubmit.disabled = false;
            suSubmit.textContent = originalLabel;
          }
        });
    });
  }

  // Build a JSON object from a form, matching the column names in Supabase.
  // - checkboxes become true/false
  // - unchecked radios are skipped, the checked one supplies the value
  // - empty text fields become null, not empty strings
  // - form_source is a display-only hidden field, not a column, so it is dropped
  // - referral codes are upper-cased so "john2026" and "JOHN2026" are the same code
  function buildPayload(form) {
    var data = {};
    var elements = form.elements;

    for (var i = 0; i < elements.length; i++) {
      var el = elements[i];

      if (!el.name) continue;
      if (el.name === "form_source") continue;
      if (el.type === "submit" || el.type === "button") continue;

      if (el.type === "checkbox") {
        data[el.name] = el.checked;
      } else if (el.type === "radio") {
        if (el.checked) data[el.name] = el.value;
      } else {
        var value = el.value.trim();
        data[el.name] = value === "" ? null : value;
      }
    }

    if (data.referral_code) {
      data.referral_code = data.referral_code.toUpperCase();
    }

    return data;
  }

  // After a successful submit the form resets, so any conditionally shown
  // field needs to go back to its default hidden state.
  function resetConditionalFields(form) {
    var estateField = form.querySelector("#estate-count-field");
    if (estateField) estateField.style.display = "none";
  }

  var forms = document.querySelectorAll("form[data-myplot-form][data-supabase-table]");

  forms.forEach(function (form) {
    var successEl = form.querySelector(".form-success");
    var errorEl = form.querySelector(".form-error");
    var submitBtn = form.querySelector(".form-submit");
    var defaultError = errorEl ? errorEl.textContent : "";

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var table = form.getAttribute("data-supabase-table");
      if (!table) {
        if (errorEl) {
          errorEl.textContent = defaultError;
          errorEl.style.display = "block";
        }
        return;
      }

      if (successEl) successEl.style.display = "none";
      if (errorEl) {
        errorEl.style.display = "none";
        errorEl.textContent = defaultError;
      }

      var originalLabel = submitBtn ? submitBtn.textContent : "";
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Sending...";
      }

      fetch(SUPABASE_URL + "/rest/v1/" + table, {
        method: "POST",
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: "Bearer " + SUPABASE_ANON_KEY,
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
        body: JSON.stringify(buildPayload(form)),
      })
        .then(function (response) {
          if (response.ok) {
            form.reset();
            resetConditionalFields(form);
            if (successEl) successEl.style.display = "block";
            return null;
          }
          return response.json().then(function (body) {
            throw body;
          });
        })
        .catch(function (err) {
          var message = defaultError;

          if (err && err.code === "23505") {
            message = "That referral code is already taken. Please choose a different one.";
          } else if (err && err.code === "23503") {
            message = "That referral code was not recognised. Please check it, or leave the field blank.";
          }

          if (errorEl) {
            errorEl.textContent = message;
            errorEl.style.display = "block";
          }
        })
        .finally(function () {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = originalLabel;
          }
        });
    });
  });

  // SellMyPlot: toggle the "number of plots" field depending on listing type
  var listingTypeRadios = document.querySelectorAll('input[name="listing_type"]');
  var estateField = document.getElementById("estate-count-field");
  if (listingTypeRadios.length && estateField) {
    listingTypeRadios.forEach(function (radio) {
      radio.addEventListener("change", function () {
        estateField.style.display = radio.value === "estate" && radio.checked ? "block" : "none";
      });
    });
  }

  // Show/hide toggle for any password field, used on signup, login, and
  // the admin login. Each toggle button declares which input it controls
  // via data-for="input-id".
  document.querySelectorAll(".password-toggle").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var input = document.getElementById(btn.getAttribute("data-for"));
      if (!input) return;
      var showing = input.type === "text";
      input.type = showing ? "password" : "text";
      btn.textContent = showing ? "Show" : "Hide";
      btn.setAttribute("aria-label", showing ? "Show password" : "Hide password");
    });
  });
});
