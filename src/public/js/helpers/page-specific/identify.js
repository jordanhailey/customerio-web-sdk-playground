import { cdpIdentify } from "../cdp-helpers.js";
import { cioIdentify } from "../cio-helpers.js";
import { getCurrentEpochTimestampInSeconds } from "../index.js";


const CIO_NO_ID_WARNING = "_cio: id can't be empty. This identify call will not be tracked."
const CIO_CALL_UNDEFINED_ERROR = "TypeError: Cannot read properties of undefined (reading 'id')"
const CIO_CALL_NULL_ERROR = "TypeError: Cannot read properties of null (reading 'id')"

const formWarning = document.getElementById("form-warning");
const form = document.getElementById("identify-form");
const inputs = document.querySelectorAll("input");
const cancelBtn = document.getElementById("cancel");
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

let submitTimeout;

cancelBtn.addEventListener("click",()=>{
  if (submitTimeout != undefined) {
    clearTimeout(submitTimeout);
    cancelBtn.innerText = "Cancel";
  }
  else {
    Array.from(inputs).forEach(input=>{input.value= ""})
  }
})
export default function identify(){
  checkForCIOorCDP()  
  
  form.addEventListener("submit", function handleSubmit(submitEvent) {
    submitEvent.preventDefault();
    cancelBtn.innerText = "Stop Submission";
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
      cancelBtn.innerText = "Cancel";
      return;
    }
    if (identifyProperties.id) {
      identifyCall.id = identifyProperties.id;
    } else {
      warningElement.innerText = CIO_NO_ID_WARNING;
      cancelBtn.innerText = "Cancel";
    }
    if (identifyProperties.email) {
      identifyCall.email = identifyProperties.email;
    }
    if (identifyProperties.customVariableName) {
      identifyCall[identifyProperties.customVariableName] =
        identifyProperties.customVariableValue || "";
    }
    output.innerText = ""
    if (Object.keys(identifyCall).length === 0) {
      console.warn("no identify call sent");
      cancelBtn.innerText = "Cancel";
    } else {
      if (window._cio) {
        cioIdentify(identifyCall);
        output.innerText += `_cio.identify(${JSON.stringify(identifyCall, null, 2)})`
      }
      if (window.analytics) {
        let userID = identifyCall.id
        let traits = {...identifyCall}
        delete(traits.id)
        cdpIdentify({userID,traits})
        output.innerText += `${output.innerText ? "\n\n" : ""}analytics.identify(\n${window.analytics._user.id() ? '"'+window.analytics._user.id()+'",\n' : "" }${JSON.stringify(traits, null, 2)})`
      }
      if (identifyCall.id) {
        submitTimeout = setTimeout(() => {
          submitEvent.target.submit();
        }, 5000); 
      }
    }
  });
}
