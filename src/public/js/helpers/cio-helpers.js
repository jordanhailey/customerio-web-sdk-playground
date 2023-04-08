const CIO_LOCALSTORAGE_NAMESPACE = "TSE_CIO_SDK_CONFIG";

const CIO_DEFAULTS = {
  siteID: "YOUR_SITE_ID",
  region: "us",
  cdpToken: "YOUR_CIO_CDP_TOKEN"
};

export function getCioConfig() {
  let siteID,
    region,
    cdpToken,
    cioConfig,
    storedState = JSON.parse(
      window.localStorage.getItem(CIO_LOCALSTORAGE_NAMESPACE)
    );
  if (storedState) {
    siteID = storedState.siteID || CIO_DEFAULTS.siteID;
    region = storedState.region || CIO_DEFAULTS.region;
    cdpToken = storedState.cdpToken || CIO_DEFAULTS.cdpToken;
    cioConfig = {siteID, region, cdpToken}
  } else {
    cioConfig = CIO_DEFAULTS
  }
  return cioConfig;
}

function setCioConfig({ siteID, region , cdpToken }) {
  window.localStorage.setItem(
    CIO_LOCALSTORAGE_NAMESPACE,
    JSON.stringify({ siteID, region , cdpToken })
  );
}

export function updateCioConfig({ siteID, region, cdpToken }) {
  let { siteID: previousSiteId, region: previousRegion, cdpToken: previousCDPToken } = getCioConfig();
  if (!previousSiteId && !previousRegion) {
    setCioConfig({ siteID, region });
  } else if (siteID != previousSiteId || region != previousRegion || cdpToken != previousCDPToken) {
    setCioConfig({ siteID, region, cdpToken });
  } else console.log("Same values provided, No changes made to CIO config");
  console.log({ siteID, region, cdpToken});
}

export const TSE_CIO_CONFIG = getCioConfig();

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

function parseString(id) {
  try {
    return JSON.parse(decodeURIComponent(id));
  } catch (error) {
    return id;
  }
}

export function getAnonymousID() {
  // Now that we might be using the CDP, we need to look for this cookie
  var ajs = getCookie('ajs_anonymous_id');
  if (ajs && ajs !== '') {
    // Segment can have quotes in their cookie value, so we'll need to decode
    // and parse that.
    return parseString(ajs);
  }
  // If analytics anonymous ID is not found, look for the JS snippet's anonymous ID
  return getCookie(window._cio.cookieNamespace + "anonid");
}

function findCustomer() {
  return getCookie(_cio.cookieNamespace + 'id');
}



export function getIdentifier() {
  try {
    if (!window._cio) {
      throw "_cio has not yet been added to the window";
    }
    return window._cio._findCustomer();
  } catch (err) {
    console.error(err);
    return "";
  }
}

export async function retrieveIdentifier() {
  let intervalAttempt = 0;
  return new Promise((resolve,reject)=>{
    if (window.TSE_CURRENT_IDENTIFIER) {
      resolve(window.TSE_CURRENT_IDENTIFIER);
    }
    let cioLoadedInterval = setInterval(() => {
      intervalAttempt++;
      let identifier = getIdentifier();
      let anonymousIdentifier = getAnonymousID();
      if (identifier) {
        clearInterval(cioLoadedInterval);
        window.TSE_CURRENT_IDENTIFIER = {identifier}
        resolve({identifier});
      } else if (anonymousIdentifier) {
        clearInterval(cioLoadedInterval);
        window.TSE_CURRENT_IDENTIFIER = {anonymousIdentifier}
        resolve({anonymousIdentifier});
      }
      // If not found, continue attempting every ~10ms for about 1 second
      if (intervalAttempt > 200) {
        console.warn("no identifier found");
        clearInterval(cioLoadedInterval);
      }
    }, 10);
  })
}

export function showIdentifierElements () {
  Array.from(document.getElementsByClassName("current-identifier"))
    .forEach(async (element) => {
      let currentIdentifier = await retrieveIdentifier().then(id=>{
        element.innerHTML = (
          `<div class="p-2">Your current ${id.identifier ? 
            "<span class=\"font-bold text-purple-500\">identifier</span>" : 
            "<span class=\"font-bold text-purple-500\">anonymous identifier</span>"} 
            is: <em class="font-bold text-purple-500">${
              id.identifier ? 
              id.identifier : 
              id.anonymousIdentifier
            }</em></div>`
          );
      });
    });
}
export function addClickListenerToResetIdentifierElements () {
  Array.from(document.getElementsByClassName("reset-identifier"))
    .forEach(async (element) => {
      let currentIdentifier = await retrieveIdentifier().then(id=>{
        element.classList.remove("hidden");
        element.addEventListener("click", (clickEvent)=>{
          window._cio.reset();
          window.location.reload();
        })
      });
    });
}