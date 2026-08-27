// MyPlot by 7Ai — shared site behavior
// Handles form submission (via Formspree, see README.md for setup) with
// inline success/error messages, no page reload.

document.addEventListener("DOMContentLoaded", function () {
  var forms = document.querySelectorAll("form[data-myplot-form]");

  forms.forEach(function (form) {
    var successEl = form.querySelector(".form-success");
    var errorEl = form.querySelector(".form-error");
    var submitBtn = form.querySelector(".form-submit");

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      if (successEl) successEl.style.display = "none";
      if (errorEl) errorEl.style.display = "none";

      var originalLabel = submitBtn ? submitBtn.textContent : "";
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Sending...";
      }

      var formData = new FormData(form);

      fetch(form.action, {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      })
        .then(function (response) {
          if (response.ok) {
            form.reset();
            if (successEl) successEl.style.display = "block";
          } else {
            if (errorEl) errorEl.style.display = "block";
          }
        })
        .catch(function () {
          if (errorEl) errorEl.style.display = "block";
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
