import { getCIOWebSDKConfig, updateCioWebSDKConfig } from "../cio-helpers.js"; 
import { getCDPConfig, setCDPConfig } from "../cdp-helpers.js"; 

const form = document.getElementById("set_cio_config");
const siteIDInput = document.getElementById("siteID");
const cancelBtn = document.getElementById("cancel");
const regionSelect = document.getElementById("region");
const regionOptions = {
  us: document.getElementById("regionUS"),
  eu: document.getElementById("regionEU"),
};
const autoPageTrackingSelect = document.getElementById("autoPageTracking");
const autoPageTrackingOptions = {
  true: document.getElementById("pageTrackingTrue"),
  false: document.getElementById("pageTrackingFalse"),
};

const cdpApiKeyInput = document.getElementById("cdpApiKey");

function addSelection(el){el.setAttribute("selected","")}
function removeSelection(el){el.removeAttribute("selected")}

function setFormValues() {
  let { siteID, region, autoPageTracking } = getCIOWebSDKConfig();
  siteIDInput.value = siteID.trim();
  getCDPConfig()
    .then((cdfCFG)=>{cdpApiKeyInput.value = cdfCFG.apiKey})
    .catch((error)=>{console.warn(error)})
  // Set page tracking region
  if (`${region}`.toLowerCase() == "eu") {
    removeSelection(regionOptions.us);
    addSelection(regionOptions.eu);
    regionSelect.value = "eu";
  } else {
    removeSelection(regionOptions.eu);
    addSelection(regionOptions.us);
    regionSelect.value = "us";
  }
  // Set page tracking
  if (`${autoPageTracking}`.toLowerCase() == "false") {
    removeSelection(autoPageTrackingOptions.true);
    addSelection(autoPageTrackingOptions.false);
    autoPageTrackingSelect.value = "false";
  } else {
    removeSelection(autoPageTrackingOptions.false);
    addSelection(autoPageTrackingOptions.true);
    autoPageTrackingSelect.value = "true";
  }
}

cancelBtn.addEventListener("click", function resetForm(cancelEvent) {
  setFormValues();
});

window.addEventListener("load", function setCurrentValues(loadEvent) {
  setFormValues();
});

form.addEventListener("submit", async function handleSubmit(submitEvent) {
  submitEvent.preventDefault();
  const data = new FormData(form);
  let cioWebSDKConfig = getCIOWebSDKConfig();
  let cioCDPConfig = await getCDPConfig();
  for (let [name, value] of data) {
    if (/cdp/.test(name)) {
      name = name.slice("cdp".length);
      name = name.charAt(0).toLowerCase() + name.slice(1);
      cioCDPConfig = Object.assign({},cioCDPConfig, {[`${name}`]: value });
    }
    cioWebSDKConfig = Object.assign({}, cioWebSDKConfig, { [`${name}`]: value });
  }
  updateCioWebSDKConfig(cioWebSDKConfig);
  setCDPConfig({config:cioCDPConfig});
});