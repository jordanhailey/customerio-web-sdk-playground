import { getCurrentEpochTimestampInSeconds } from "../index.js";

const eventPayloads = {
  "event-1": {
    name: "cio_web_sdk_test_event_1",
    properties: {
      message: "Testing the Customer.io Web SDK",
      source: window.location.href,
    },
  },
};

function clickListenerToCIOWebSDKEvent(button) {
  return function (eventName) {
    button.addEventListener("click", function clickEventListener(e) {
      const timestamp = getCurrentEpochTimestampInSeconds();
      return sendEventMetadata({
        event: getEventMetadata(eventName),
        timestamp,
      });
    });
  };
}

function clickListenerToCIOWebSDKPageEvent(button) {
  let hash = button.dataset.hash || "#";
  button.addEventListener("click", function clickEventListener(e) {
    let loc = new URL(window.location.href);
    loc.hash = hash;
    window._cio.page(loc.href);
    if (window.analytics) {
      try {
        window.analytics.page(loc.href)
          .then(call=>console.log(call))
      } catch (err) {
        console.error(err)
      }
    }
    window.location.replace(loc.href);
  });
}

function sendEventMetadata({ event: { name, properties }, timestamp }) {
  properties.timestamp = timestamp;
  try {
    window._cio.track(name, { ...properties });
    console.log({ sentEvent: { name, properties } });
    if (window.analytics) {
      window.analytics.track(`cdp_${name}`, { ...properties })
        .then(call=>{console.log("Analytics call sent",call)})
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
  // Attach Event Listeners
  clickListenerToCIOWebSDKEvent(sendTest1)("event-1");
  clickListenerToCIOWebSDKPageEvent(sendPage1);
  clickListenerToCIOWebSDKPageEvent(sendPage2);
  clickListenerToCIOWebSDKPageEvent(sendPage3);
  clickListenerToCIOWebSDKPageEvent(sendPage4);
}