const $topContainer = $(".top-container");
const $leftContainer = $(".left-circle");
const $rightContainer = $(".right-container");
const $reserveForm = $(".reserve-form");

function resizeElements() {
  const viewportWidth = window.innerWidth;
  const availableSpace = (viewportWidth - 1128) / 2;

  if (availableSpace > 0) {
    console.log(true, availableSpace);
    // $topContainer.add($leftContainer).add($rightContainer).removeClass("visually-hidden");
    $topContainer.height(availableSpace);
    // $rightContainer.width(availableSpace);
    // $rightContainer.css("right", -availableSpace);
  } else {
    console.log(false, availableSpace);
    // $topContainer.add($leftContainer).add($rightContainer).addClass("visually-hidden");
  }
}

function formHandler(event) {
  event.preventDefault();

  const formDataArray = $(this).serializeArray();
  const formDataObject = {};
  $.each(formDataArray, function (index, item) {
    formDataObject[item.name] = item.value;
  });

  const $inputs = $(this).find("input[type='text'], input[type='email']");
  let hasErrors = false;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  $inputs.each(function () {
    const $input = $(this);
    const inputName = $input.attr("name");
    const inputValue = formDataObject[inputName] || "";
    const $inputTitle = $input.prev(".input-title");
    const $message = $inputTitle.find("p.filled, p.error");
    const $parentLabel = $input.closest("label.input-label");
    const isRequired = $parentLabel.length > 0 && $parentLabel.hasClass("required");

    if (isRequired && inputValue.trim() === "") {
      $message.removeClass("filled").addClass("error");
      $message.text("Pflichtfelder");
      hasErrors = true;
    } else if (inputName === "email" && !emailRegex.test(inputValue)) {
      $message.removeClass("filled").addClass("error");
      $message.text("Bitte geben Sie eine gültige E-Mail-Adresse ein");
      hasErrors = true;
    } else {
      $message.removeClass("error").addClass("filled");
      $message.text("Pflichtfelder");
    }
  });

  const $checkboxes = $(this).find("input[type='checkbox'][name^='LEGAL_CONSENT']");
  $checkboxes.each(function () {
    const $checkbox = $(this);
    const $checkboxWrapper = $checkbox.closest(".custom-checkbox");
    const isRequired = $checkboxWrapper.hasClass("required");
    const checkboxName = $checkbox.attr("name");

    formDataObject[checkboxName] = $checkbox.prop("checked") ? "on" : "off";

    if (isRequired && !$checkbox.prop("checked")) {
      $checkboxWrapper.addClass("error");
      hasErrors = true;
    } else {
      $checkboxWrapper.removeClass("error");
    }
  });

  console.log(formDataObject);

  if (hasErrors) {
    console.log("form error");
    return;
  }

  const $successMessage = $(".submit-success");
  $successMessage.removeClass("visually-hidden");
  $reserveForm.addClass("visually-hidden");

  const properties = Object.keys(formDataObject).map(key => ({
    name: key,
    value: formDataObject[key],
  }));

  let request = {
    fields: properties,
  };

  request = JSON.stringify(request);
  alert(request);

  fetch("http://localhost:3000/submissions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: request,
  })
    .then(response => response.json())
    .then(data => {
      if (data.status === "success" || data.inlineMessage) {
        $("#submit_form").hide();
        $(".success-message").css("display", "block");
      } else {
        console.error("Error:", data);
      }
    })
    .catch(error => {
      console.error("Error:", error);
    });
}

$(document).ready(resizeElements);
$(window).resize(resizeElements);
$reserveForm.on("submit", formHandler);
