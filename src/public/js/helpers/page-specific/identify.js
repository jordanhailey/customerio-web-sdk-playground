import { getCurrentEpochTimestampInSeconds } from "../index.js";
import { showIdentifierElements, addClickListenerToResetIdentifierElements } from "../cio-helpers.js";

showIdentifierElements();
addClickListenerToResetIdentifierElements();

const CIO_NO_ID_WARNING = "_cio: id can't be empty. This identify call will not be tracked."
const CIO_CALL_UNDEFINED_ERROR = "TypeError: Cannot read properties of undefined (reading 'id')"
const CIO_CALL_NULL_ERROR = "TypeError: Cannot read properties of null (reading 'id')"

const form = document.getElementById("identify-form");
const warningElement = document.getElementById("identify-call-warning");
const errorElement = document.getElementById("identify-call-error");
const output = document.getElementById("identify-call-output");


form.addEventListener("submit", function handleSubmit(submitEvent) {
  submitEvent.preventDefault();
  console.log({submitEvent});
  errorElement.innerText = "";
  warningElement.innerText = "";
  output.innerText = "";
  const data = new FormData(form);
  let identifyProperties = {},
    identifyCall = {};
  for (const [name, value] of data) {
    identifyProperties = Object.assign(identifyProperties, {
      [`${name}`.trim()]: `${value}`.trim(),
    });
  }
  let completelyEmpty = true;
  for (let key in identifyProperties) {
    if (identifyProperties[key]) completelyEmpty = false;
  }
  if (completelyEmpty) {
    errorElement.innerText = CIO_CALL_UNDEFINED_ERROR;
    return;
  }
  if (identifyProperties.id) {
    identifyCall.id = identifyProperties.id;
  } else {
    warningElement.innerText = CIO_NO_ID_WARNING;
  }
  if (identifyProperties.email) {
    identifyCall.email = identifyProperties.email;
  }
  if (identifyProperties.customVariableName) {
    identifyCall[identifyProperties.customVariableName] =
      identifyProperties.customVariableValue;
  }
  console.log({ identifyProperties, identifyCall });
  output.innerText = JSON.stringify(identifyCall, null, 2);
  if (Object.keys(identifyCall).length === 0) {
    console.log("no identify call sent");
  } else {
    window._cio.identify(identifyCall);
    if (identifyCall.id) {
      setTimeout(() => {
        submitEvent.target.submit();
      }, 3000);
    }
  }
});
