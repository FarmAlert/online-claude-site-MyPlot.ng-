// MyPlot by 7Ai — shared site behavior
// Form submissions go directly to Supabase. Each form declares which table
// it writes to via data-supabase-table="...". See myplot_schema.sql.
//
// The anon key below is safe to expose publicly. Row Level Security on the
// database allows INSERT only, never SELECT, so nobody can read submissions
// back through this key.

var SUPABASE_URL = "https://krxsfjzcvhvatplrttmf.supabase.co";
var SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtyeHNmanpjdmh2YXRwbHJ0dG1mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkwNjk1MjMsImV4cCI6MjEwNDY0NTUyM30.H_rojfXJhOJHrMrL6vbr46meh27kpeoqE-7N5mSQGts";

document.addEventListener("DOMContentLoaded", function () {

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

  var forms = document.querySelectorAll("form[data-myplot-form]");

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
          errorEl.scrollIntoView({ behavior: "smooth", block: "center" });
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
            if (successEl) {
              successEl.style.display = "block";
              successEl.scrollIntoView({ behavior: "smooth", block: "center" });
            }
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
            errorEl.scrollIntoView({ behavior: "smooth", block: "center" });
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
});
