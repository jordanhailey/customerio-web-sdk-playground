import { getCioConfig, updateCioConfig } from "../cio-helpers.js"; 
const form = document.getElementById("set_cio_config");
const siteIDInput = document.getElementById("siteID");
const cancelBtn = document.getElementById("cancel");
const regionSelect = document.getElementById("region");
const regionOptions = {
  us: document.getElementById("regionUS"),
  eu: document.getElementById("regionEU"),
};

function setFormValues() {
  let { siteID: currentSiteID, region: currentRegion } = getCioConfig();
  siteIDInput.value = currentSiteID;
  if (`${currentRegion}`.toLowerCase() == "regionus") {
    regionOptions.eu.removeAttribute("selected");
    regionOptions.us.setAttribute("selected", true);
    regionSelect.value = "regionUS";
  } else {
    regionOptions.us.removeAttribute("selected");
    regionOptions.eu.setAttribute("selected", true);
    regionSelect.value = "regionEU";
  }
}
cancelBtn.addEventListener("click", function resetForm(cancelEvent) {
  setFormValues();
});

window.addEventListener("load", function setCurrentValues(loadEvent) {
  setFormValues();
});

form.addEventListener("submit", function handleSubmit(submitEvent) {
  submitEvent.preventDefault();
  const data = new FormData(form);
  let cioConfig = {
    siteID: undefined,
    region: undefined,
  };
  for (const [name, value] of data) {
    cioConfig = Object.assign({}, cioConfig, { [`${name}`]: value });
  }
  updateCioConfig(cioConfig);
});