import "./helpers/cio-helpers.js"
import "./cio-tracking-snippet.js";

// IIFE - get current location and load relevant modules
const LOCATION = window.location;
(()=>{
  import("./helpers/components/nav-helpers.js")
    .then(obj => (obj))
    .catch(err => (console.error(err)));
  switch (LOCATION.pathname) {
    case "/":
      import("./helpers/page-specific/index.js").then(js=>(js)).catch(err=>(console.error(err)))
      break;
    case "/configuration/":
      import("./helpers/page-specific/configuration.js").then(js=>(js)).catch(err=>(console.error(err)))
      break;
    case "/events/":
      import("./helpers/page-specific/events.js").then(js=>(js)).catch(err=>(console.error(err)))
      break;
    case "/identify/":
      import("./helpers/page-specific/identify.js").then(js=>(js)).catch(err=>(console.error(err)))
      break;
    default:
      console.log(LOCATION.pathname)
      break;
  }
})()
