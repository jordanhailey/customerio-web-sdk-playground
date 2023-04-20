import { cdpGetIdentifier } from "./cdp-helpers.js";
import { getCurrentEpochTimestampInSeconds } from "./index.js" 

export const CIO_JS_SDK_LOCALSTORAGE_NAMESPACE = "CIO_WEB_SDK_CONFIG";

const CIO_JS_SDK_DEFAULTS = {
  siteID: "",
  region: "regionUS",
  autoPageTracking: "true",
};




/**
 * Fetches CIO Web SDK Config from localStorage, or provides defaults
 * @returns {object} `cioConfig` The configuration for the CIO Web SDK containing the following properties
 * @returns {string} `cioConfig.siteID`
 * @returns {string} `cioConfig.region`
 * @returns {string} `cioConfig.autoPageTracking`
 */
export function cioGetConfig() {
  let siteID,
    region,
    autoPageTracking,
    storedState = JSON.parse(
      window.localStorage.getItem(CIO_JS_SDK_LOCALSTORAGE_NAMESPACE)
    );
  siteID = storedState?.siteID || CIO_JS_SDK_DEFAULTS.siteID;
  region = storedState?.region || CIO_JS_SDK_DEFAULTS.region;
  autoPageTracking = storedState?.autoPageTracking || CIO_JS_SDK_DEFAULTS.autoPageTracking;
  
  let lastUpdatedEpoch = storedState?.lastUpdated || 0;

  if ((getCurrentEpochTimestampInSeconds() - lastUpdatedEpoch) > (60*60*24*7)) {
    // console.log("invalid cache, over one week old, resetting localStorage and identifiers.")
  } else {}
  let cioConfig = { siteID, region, autoPageTracking };
  if (!storedState) cioSetConfig({...cioConfig});
  return cioConfig;
}

export const CIO_JS_SDK_CONFIG = cioGetConfig();


function cioSetConfig({ siteID, region, autoPageTracking }) {
  window.localStorage.setItem(
    CIO_JS_SDK_LOCALSTORAGE_NAMESPACE,
    JSON.stringify({ siteID, region, autoPageTracking, lastUpdated: getCurrentEpochTimestampInSeconds() })
  );
}

export function cioResetConfig(){
  cioSetConfig(CIO_JS_SDK_DEFAULTS)
}

/**
 * Updates CIO Web SDK Config
 * @param {string} siteID _default: `""`_ @param {string} region _default: `"regionUS"`_ @param {string} autoPageTracking _default: `"true"`_
 */
export function updateCioWebSDKConfig({ siteID=CIO_JS_SDK_DEFAULTS.siteID, region=CIO_JS_SDK_DEFAULTS.region, autoPageTracking=CIO_JS_SDK_DEFAULTS.autoPageTracking }) {
  let newConfig = { siteID, region, autoPageTracking, lastUpdated: getCurrentEpochTimestampInSeconds() };
  let currentConfig = cioGetConfig();
  let changesToConfig = false;
  for (let key in newConfig) {
    if (newConfig[key] != currentConfig[key]) {
      changesToConfig = true;
      console.log(`Updating ${key}`);
    }
  }
  if (changesToConfig) {
    cioSetConfig({...newConfig});
    console.log({...newConfig});
  }
}

function getCookie(c_name) {
  const allCookies = document.cookie;
  if (allCookies.length > 0) {
    let c_start = allCookies.indexOf(c_name + "=");
    if (c_start != -1) {
      c_start = c_start + c_name.length + 1;
      let c_end = allCookies.indexOf(";", c_start);
      if (c_end == -1) c_end = allCookies.length;
      return decodeURIComponent(allCookies.substring(c_start, c_end));
    }
  }
  return "";
}

export function cioGetAnonymousID() {
  var ajs = getCookie('ajs_anonymous_id');
  if (ajs && ajs !== '') {
    // Segment can have quotes in their cookie value, so we'll need to decode
    // and parse that.
    return parseString(ajs);
  }  
  return getCookie(window._cio.cookieNamespace + "anonid");
}

function parseString(id) {
  try {
    return JSON.parse(decodeURIComponent(id));
  } catch (error) {
    return id;
  }
}


export function cioResetIdentifier() {
  let allowedRejectionReason = "_cio has not yet been added to the window";
  try {
    if (window._cio && !Array.isArray(window._cio)) {
      window._cio.reset();
      window.localStorage.removeItem("gist.web.userToken");
      window.location.reload();
    } else throw "_cio has not yet been added to the window";
  } catch (err) {
    if (err != allowedRejectionReason) console.error(err);
  }
}
export async function cioGetIdentifier() {
  return new Promise((resolve,reject)=>{
    let identifier="", anonymousIdentifier="";
    try {
      if (window._cio) {
        [identifier, anonymousIdentifier] = (
          [window._cio._findCustomer(), cioGetAnonymousID()]
          );
        if(identifier == "") {
          identifier = cdpGetIdentifier().then(ids=>{
            return ids.identifier ? ids.identifier : ""
          })
        }
        resolve({identifier,anonymousIdentifier});
      } else throw "_cio is not loaded"
    } catch (err) {
      resolve({identifier,anonymousIdentifier});
    }
  })
}

export async function cioIdentify({id,...args}){
  try {
    window._cio.identify({id,...args});
    console.log("_cio identify call sent",{id,...args});
  } catch (err) {
    console.error(err)
  }
}

export async function cioTrack({eventName,...args}){
  try {
    window._cio.track(eventName,{...args});
    console.log("_cio track call sent",{eventName},{...args});
  } catch (err) {
    console.error(err)
  }
}

export async function cioPage({location,...args}){
  try {
    window._cio.page(location,{...args});
    console.log("_cio page call sent",{location},{...args});
  } catch (err) {
    console.error(err)
  }
}


