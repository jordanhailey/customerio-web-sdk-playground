import * as cioHelpers from "./helpers/cio-helpers.js";
import * as cdpHelpers from "./helpers/cdp-helpers.js";
import "./cio-tracking-snippet.js";
import "./cio-cdp-snippet.js";

window.cdpLoaded = false;
window.cioLoaded = false;
window.playground = {};
const playground = window.playground;
const _helpers = {};

window.addEventListener("load", function windowLoaded(){
  let trackerInterval = setInterval(function lookForTrackers(){
    if (!playground.cdpLoaded){
      let cfg = window.localStorage.getItem(cdpHelpers.CDP_LOCALSTORAGE_NAMESPACE);
      if (cfg) {
        try {
          cfg = JSON.parse(cfg)
        } catch (error) {}
        playground.cdpLoaded = cfg?.apiKey ? true : false;
      }
    }
    if (!playground.cioLoaded){
      let cfg = window.localStorage.getItem(cioHelpers.CIO_JS_SDK_LOCALSTORAGE_NAMESPACE);
      if (cfg) {
        try {
          cfg = JSON.parse(cfg)
        } catch (error) {}
        playground.cioLoaded = cfg?.siteID ? true : false;
      }
    }
    if (playground.cioLoaded || playground.cdpLoaded) {
      clearInterval(trackerInterval)
    }
  },100)
})

_helpers.clearIdentifiers = function clearIdentifiers(){
  cioHelpers.cioResetIdentifier();
  cdpHelpers.cdpResetIdentifier();
  window.location.reload();
}
_helpers.getIdentifiers = async function getIdentifiers() {
  let cio = await cioHelpers.cioGetIdentifier();
  let cdp = await cdpHelpers.cdpGetIdentifier();
  return {cio,cdp}
}

_helpers.propogateIdentifier = function propogateIdentifier(id) {
  try {
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
        element.addEventListener("click", function resetCioIdentifiers(){
          _helpers.clearIdentifiers();
        })
      }); 
    return id;
  } catch (error) {
    return false
  }
}

/**
 * 
 * @param {string} key The value of the item to remove from localStorage
 */
_helpers.wipeOutLocalStorage = function wipeOutLocalStorage(key=""){
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
/**
 * 
 * @param {string} key The value of the item to remove from localStorage
 */
_helpers.wipeOutCookies = function wipeOutCookies(key=""){
  if (document.cookie) {
    const currentCookies = Array.from(document.cookie.split(";")).map(function(c) {
      let [name,value] = [c.slice(0,c.indexOf("=")).trim(),c.slice(c.indexOf("=")+1).trim()]
      return {name,value};
    });
    if (key) {
      console.warn("clearing cookie value for", key);
      // window.localStorage.removeItem(key);
    } else {
        console.warn("clearing all cookies",currentCookies);
        document.cookie.split(";").forEach(function(c) { document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); });
        
      }
    }
}


_helpers.disconnectAll = function disconnectAll(){
  _helpers.wipeOutLocalStorage();
  _helpers.wipeOutCookies();
  cioHelpers.cioResetIdentifier();
  cioHelpers.cioResetConfig();
  cdpHelpers.cdpResetIdentifier();
  cdpHelpers.cdpResetConfig();
}

playground._helpers = _helpers;

// IIFE - get current location and load relevant modules
const LOCATION = window.location;
function loadPageJS(){
  import("./helpers/components/nav-helpers.js")
    .then(function navComponentJSLoaded(nav){return nav})
    .catch(function navComponentJSNotFound(err){console.error(err)});
  let pageSpecificJS = "";
    switch (LOCATION.pathname) {
    case "/":
      pageSpecificJS = "index"
      break;
    case "/configuration/":
      pageSpecificJS = "configuration"
      break;
      case "/events/":
      pageSpecificJS = "events"
      break;
      case "/identify/":
      pageSpecificJS = "identify"
      break;
      case "/in-app/":
      pageSpecificJS = "in-app"
      break;
      case "/cdp/":
      pageSpecificJS = "cdp"
      break;
    default:
      console.log(LOCATION.pathname)
      break;
  }
  if (pageSpecificJS) {
    getPageSpecificJS(pageSpecificJS)
  }
}

function getPageSpecificJS(pageName){ 
  const moduleFailedToLoadError = "no default export";
  let jsFile;
  import(`./helpers/page-specific/${pageName}.js`)
  .then(function pageSpecificJSFetched(pageHelpers){
    jsFile = pageHelpers; 
    if (pageHelpers.default) return pageHelpers.default();
    else throw moduleFailedToLoadError;
  })
  .catch(function errorLoadingPageSpecificJS(moduleError){
    if (moduleError !== moduleFailedToLoadError) console.warn(moduleError)
    })
}

loadPageJS()

