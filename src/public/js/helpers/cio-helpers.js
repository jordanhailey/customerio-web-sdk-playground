import { getCurrentEpochTimestampInSeconds } from "./index.js" 

const CIO_JS_SDK_LOCALSTORAGE_NAMESPACE = "CIO_WEB_SDK_CONFIG";

const CIO_JS_SDK_DEFAULTS = {
  siteID: "",
  region: "regionUS",
  autoPageTracking: "true",
};

/**
 * 
 * @param {string} key The value of the item to remove from localStorage
 */
export function wipeOutLocalStorage(key=""){
  if (window.localStorage) {
    if (key) {
      console.warn("clearing entire localStorage value for", key, window.localStorage.getItem(key));
      window.localStorage.removeItem(key);
    } else {
        console.warn("clearing entire localStorage Object",window.localStorage);
        for (let item in window.localStorage) {
          window.localStorage.removeItem(item);
        }
      }
    }
}
// wipeOutLocalStorage();



/**
 * Fetches CIO Web SDK Config from localStorage, or provides defaults
 * @returns {object} `cioConfig` The configuration for the CIO Web SDK containing the following properties
 * @returns {string} `cioConfig.siteID`
 * @returns {string} `cioConfig.region`
 * @returns {string} `cioConfig.autoPageTracking`
 */
export function getCIOWebSDKConfig() {
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
    // wipeOutLocalStorage()
    // resetIdentifier()
  } else {}
  let cioConfig = { siteID, region, autoPageTracking, lastUpdated: getCurrentEpochTimestampInSeconds() };
  if (!storedState) setCIOWebSDKConfig({...cioConfig})
  return cioConfig;
}

export const CIO_JS_SDK_CONFIG = getCIOWebSDKConfig();

function setCIOWebSDKConfig({ siteID, region, autoPageTracking, lastUpdated }) {
  window.localStorage.setItem(
    CIO_JS_SDK_LOCALSTORAGE_NAMESPACE,
    JSON.stringify({ siteID, region, autoPageTracking, lastUpdated })
  );
}

/**
 * Updates CIO Web SDK Config
 * @param {string} siteID _default: `""`_ @param {string} region _default: `"regionUS"`_ @param {string} autoPageTracking _default: `"true"`_
 */
export function updateCioWebSDKConfig({ siteID=CIO_JS_SDK_DEFAULTS.siteID, region=CIO_JS_SDK_DEFAULTS.region, autoPageTracking=CIO_JS_SDK_DEFAULTS.autoPageTracking }) {
  let newConfig = { siteID, region, autoPageTracking, lastUpdated: getCurrentEpochTimestampInSeconds() };
  let currentConfig = getCIOWebSDKConfig();
  let changesToConfig = false;
  for (let key in newConfig) {
    if (newConfig[key] != currentConfig[key]) {
      changesToConfig = true;
      console.log(`Updating ${key}`);
    }
  }
  if (changesToConfig) {
    setCIOWebSDKConfig({...newConfig});
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

export function getAnonymousID() {
  var ajs = getCookie('ajs_anonymous_id');
  if (ajs && ajs !== '') {
    // Segment can have quotes in their cookie value, so we'll need to decode
    // and parse that.
    return parseString(ajs);
  }  
  return getCookie(window._cio.cookieNamespace + "anonid");
}

function findCustomer() {
  return getCookie(_cio.cookieNamespace + 'id');
}

function parseString(id) {
  try {
    return JSON.parse(decodeURIComponent(id));
  } catch (error) {
    return id;
  }
}

export function resetIdentifier() {
  let allowedRejectionReason = "_cio has not yet been added to the window";
  try {
    if (window._cio && !Array.isArray(window._cio)) {
      window._cio.reset();
      window.localStorage.removeItem("gist.web.userToken");
      if (window.analytics) {
        window.analytics.reset();
      }
      window.location.reload();
    } else throw "_cio has not yet been added to the window";
  } catch (err) {
    if (err != allowedRejectionReason) console.error(err);
  }
}
export function getIdentifier() {
  let allowedRejectionReason = "_cio has not yet been added to the window";
  try {
    if (window._cio && !Array.isArray(window._cio)) {
      let [identifier, anonymousIdentifier] = [window._cio._findCustomer(), getAnonymousID()];
      return identifier != "" ? {identifier} : {anonymousIdentifier};
    } else throw "_cio has not yet been added to the window";
  } catch (err) {
    if (err != allowedRejectionReason) console.error(err);
    return "";
  }
}

export function retrieveIdentifier() {
  let intervalAttempt = 0;
  return new Promise((resolve,reject)=>{
    if (window.TSE_CURRENT_IDENTIFIER) {
      resolve(window.TSE_CURRENT_IDENTIFIER);
    }
    let cioLoadedInterval = setInterval(function searchingForIdentifier() {
      intervalAttempt++;
      const id = { ...getIdentifier() };
      if ( id.identifier || id.anonymousIdentifier ) {
        clearInterval(cioLoadedInterval);
        window.TSE_CURRENT_IDENTIFIER = id
        resolve(id);
      }
      // If not found, continue attempting every ~100ms for about 1 second
      if (intervalAttempt > 10) {
        clearInterval(cioLoadedInterval);
        reject("no identifier found");
      }
    }, 100);
  })
}

export async function showIdentifierElements() {
  return new Promise(async function fetchingIdentifier(resolve,reject){
    retrieveIdentifier()
      .then(id=>{
        Array.from(document.getElementsByClassName("current-identifier"))
          .forEach(function updateHTML(element) {
            element.innerHTML = `<div class="p-2">Your current ${id.identifier ? 
              "<span class=\"font-bold text-purple-500\">identifier</span>" : 
              "<span class=\"font-bold text-purple-500\">anonymous identifier</span>"} 
              is: <em class="font-bold text-purple-500">${
                id.identifier ? 
                id.identifier : 
                id.anonymousIdentifier
              }</em></div>`
          });
        Array.from(document.getElementsByClassName("reset-current-identifier"))
          .forEach(function updateHTML(element) {
            element.classList.remove("hidden");
            element.addEventListener("click", function resetIdentifiers(){
              resetIdentifier();
            })
          })
        resolve(true);
      })
      .catch(function idNotFound(err){reject(err)});
  }) 
}
