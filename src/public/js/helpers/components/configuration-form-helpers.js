import { cioGetConfig, updateCioWebSDKConfig } from "../cio-helpers.js"; 
import { cdpGetConfig, cdpSetConfig } from "../cdp-helpers.js"; 
import { disconnectAll } from "../../main.js";

const form = document.getElementById("set_cio_config");
const siteIDInput = document.getElementById("siteID");
const cancelBtn = document.getElementById("cancel");
const disconnectBtn = document.getElementById("disconnect");
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

function setFormValues(disconnect=false) {
  if (disconnect === null) {
    console.warn("disconnecting website from your workspace");
    disconnectAll()
  }
  let { siteID, region, autoPageTracking } = cioGetConfig();
  siteIDInput.value = siteID.trim();
  cdpGetConfig()
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

disconnectBtn.addEventListener("click", function disconnectSite(cancelEvent) {
  setFormValues(null);
});

window.addEventListener("load", function setCurrentValues(loadEvent) {
  setFormValues();
});

form.addEventListener("submit", async function handleSubmit(submitEvent) {
  submitEvent.preventDefault();
  const data = new FormData(form);
  let cioWebSDKConfig = cioGetConfig();
  let cioCDPConfig = await cdpGetConfig();
  for (let [name, value] of data) {
    if (/cdp/.test(name)) {
      name = name.slice("cdp".length);
      name = name.charAt(0).toLowerCase() + name.slice(1);
      cioCDPConfig = Object.assign({},cioCDPConfig, {[`${name}`]: value });
    }
    cioWebSDKConfig = Object.assign({}, cioWebSDKConfig, { [`${name}`]: value });
  }
  updateCioWebSDKConfig(cioWebSDKConfig);
  cdpSetConfig({config:cioCDPConfig});
});