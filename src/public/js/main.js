import "./helpers/cio-helpers.js"
import "./cio-tracking-snippet.js";

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

