const CIO_LOCALSTORAGE_NAMESPACE = "TSE_CIO_SDK_CONFIG";

const CIO_DEFAULTS = {
  siteID: "",
  region: "regionUS",
};

export function getCioConfig() {
  let siteID,
    region,
    storedState = JSON.parse(
      window.localStorage.getItem(CIO_LOCALSTORAGE_NAMESPACE)
    );
  if (storedState) {
    siteID = storedState.siteID || CIO_DEFAULTS.siteID;
    region = storedState.region || CIO_DEFAULTS.region;
  }
  let cioConfig = { siteID, region };
  return cioConfig;
}

function setCioConfig({ siteID, region }) {
  window.localStorage.setItem(
    CIO_LOCALSTORAGE_NAMESPACE,
    JSON.stringify({ siteID, region })
  );
}

export function updateCioConfig({ siteID, region }) {
  let newConfig = { siteID, region };
  let currentConfig = getCioConfig();
  let { siteID: previousSiteId, region: previousRegion } = getCioConfig();
  let changesToConfig = false;
  for (let key in newConfig) {
    if (newConfig[key] != currentConfig[key]) {
      changesToConfig = true;
      console.log(`Updating ${key}`);
    }
  }
  if (changesToConfig) {
    setCioConfig({...newConfig});
    console.log({...newConfig});
  }
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

export function getAnonymousID() {
  return getCookie(window._cio.cookieNamespace + "anonid");
}

export function resetIdentifier() {
  let allowedRejectionReason = "_cio has not yet been added to the window";
  try {
    if (window._cio && !Array.isArray(window._cio)) {
      window._cio.reset();
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
      // If not found, continue attempting every ~10ms for about 1 second
      if (intervalAttempt > 100) {
        clearInterval(cioLoadedInterval);
        reject("no identifier found");
      }
    }, 10);
  })
}

export function showIdentifierElements() {
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
    })
    .catch(function idNotFound(err){console.warn(err);return ""});
}