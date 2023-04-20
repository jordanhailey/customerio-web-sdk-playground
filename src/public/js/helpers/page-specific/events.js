import { cdpPage, cdpTrack } from "../cdp-helpers.js";
import { cioPage, cioTrack } from "../cio-helpers.js";
import { getCurrentEpochTimestampInSeconds } from "../index.js";

let isCioInitialized = {timeout:undefined,attempts:0}
function checkForCIO(){
  try {
    clearTimeout(isCioInitialized.timeout);
    if (window?._cio?.track || window?.analytics?.track) {
    } else {
      isCioInitialized.attempts++
      if (isCioInitialized.attempts > 10) {
        clearTimeout(isCioInitialized.timeout)
        throw "Web SDK not loaded"
      }
      isCioInitialized.timeout = setTimeout(()=>{
        checkForCIO();
      },100)
    }
  } catch (error) {
    Array.from(document.getElementsByClassName("no-snippet-warning")).forEach(el=>{
      el.classList.remove("hidden");
    })
    Array.from(document.querySelectorAll("main button")).forEach(el=>{
      el.setAttribute("disabled","");
    })
  }
}

const eventPayloads = {
  "event-1": {
    name: "playground_test_event_1",
    properties: {
      message: "Testing the Customer.io Web SDK",
      source: window.location.href,
    },
  },
};

let eventClickCount = 0;
function clickListenerToCIOWebSDKEvent(button) {
  return function (eventName) {
    button.addEventListener("click", function clickEventListener(e) {
      eventClickCount++
      const timestamp = getCurrentEpochTimestampInSeconds();
      return sendEventMetadata({
        event: getEventMetadata(eventName),
        timestamp,
      });
    });
  };
}
let pageViewClickCount = 0;
function clickListenerToCIOWebSDKPageEvent(button) {
  let hash = button.dataset.hash || "#";
  button.addEventListener("click", function clickEventListener(e) {
    let loc = new URL(window.location.href);
    loc.hash = hash;
    pageViewClickCount++
    if (window._cio?.page) {
      cioPage({location:loc.href,properties:{pageViewClickCount}})
    }
    if (window.analytics?.page) {
      cdpPage(loc.href);
    }
    window.location.replace(loc.href);
  });
}

function sendEventMetadata({ event: { name, properties={} }, timestamp }) {
  properties.timestamp = timestamp;
  properties.eventClickCount = eventClickCount;
  try {
    if (window._cio?.track) {
      cioTrack({eventName:`websdk_${name}`,...properties})
    }
    if (window.analytics?.track) {
      cdpTrack({name:`cdp_${name}`,properties});
    }
  } catch (err) {
    console.error({
      error: { message: err, metaData: { name, ...properties } },
    });
  }
}

function getEventMetadata(eventName) {
  return eventPayloads[eventName];
}

// Get buttons
function getElementById(id) {
  return document.getElementById(id);
}

const sendTest1 = getElementById("send-event-1");

const sendPage1 = getElementById("send-page-1");
const sendPage2 = getElementById("send-page-2");
const sendPage3 = getElementById("send-page-3");
const sendPage4 = getElementById("send-page-4");

export default function events() {
  checkForCIO();
  // Attach Event Listeners
  clickListenerToCIOWebSDKEvent(sendTest1)("event-1");
  clickListenerToCIOWebSDKPageEvent(sendPage1);
  clickListenerToCIOWebSDKPageEvent(sendPage2);
  clickListenerToCIOWebSDKPageEvent(sendPage3);
  clickListenerToCIOWebSDKPageEvent(sendPage4);
}