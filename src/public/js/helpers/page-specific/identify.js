import { cdpIdentify } from "../cdp-helpers.js";
import { cioIdentify } from "../cio-helpers.js";
import { getCurrentEpochTimestampInSeconds } from "../index.js";


const CIO_NO_ID_WARNING = "_cio: id can't be empty. This identify call will not be tracked."
const CIO_CALL_UNDEFINED_ERROR = "TypeError: Cannot read properties of undefined (reading 'id')"
const CIO_CALL_NULL_ERROR = "TypeError: Cannot read properties of null (reading 'id')"

const formWarning = document.getElementById("form-warning");
const form = document.getElementById("identify-form");
const inputs = document.querySelectorAll("input");
const warningElement = document.getElementById("identify-call-warning");
const errorElement = document.getElementById("identify-call-error");
const output = document.getElementById("identify-call-output");

let isTrackerInitialized = {timeout:undefined,attempts:0};
function checkForCIOorCDP(){
  try {
    clearTimeout(isTrackerInitialized.timeout);
    if (window?._cio?.identify || window?.analytics?.identify) {
      inputs.forEach(el=>{
        el.removeAttribute("disabled");
      })
    } else {
      isTrackerInitialized.attempts++
      if (isTrackerInitialized.attempts > 4) {
        clearTimeout(isTrackerInitialized.timeout)
        throw "Web SDK and CDP is not loaded"
      }
      isTrackerInitialized.timeout = setTimeout(()=>{
        checkForCIOorCDP();
      },100)
    }
  } catch (error) {
    console.log(error);
    formWarning.classList.remove("hidden");
  }
}

export default function identify(){
  checkForCIOorCDP()  
  
  form.addEventListener("submit", function handleSubmit(submitEvent) {
    submitEvent.preventDefault();
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
        identifyProperties.customVariableValue || "";
    }
    output.innerText = JSON.stringify(identifyCall, null, 2);
    if (Object.keys(identifyCall).length === 0) {
      console.warn("no identify call sent");
    } else {
      if (window._cio) {
        cioIdentify(identifyCall);
      }
      if (window.analytics) {
        let userID = identifyCall.id
        let traits = {...identifyCall}
        delete(traits.id)
        cdpIdentify({userID,traits})
      }
      if (identifyCall.id) {
        setTimeout(() => {
          submitEvent.target.submit();
        }, 10000); 
      }
    }
  });
}
