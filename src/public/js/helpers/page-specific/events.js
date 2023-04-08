import { getCurrentEpochTimestampInSeconds } from "../index.js";
import { showIdentifierElements,addClickListenerToResetIdentifierElements } from "../cio-helpers.js";

const eventPayloads = {
  "event-1": {
    name: "cio_web_sdk_test_event_1",
    properties: {
      message: "Testing the Customer.io Web SDK",
      source: window.location.href,
    },
  },
};

function clickListenerToCIO(button) {
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
function getEventMetadata(eventName) {
  return eventPayloads[eventName];
}
function sendEventMetadata({ event: { name, properties }, timestamp }) {
  properties.timestamp = timestamp;
  try {
    window._cio.track(name, { ...properties });
    window.analytics.track(`cdp_${name}`, {...properties })
      .then(analyticsTrack=>console.log({analyticsTrack}))
      .catch(err=>console.error(err))
    console.log({ sentEvent: { name, properties } });
  } catch (err) {
    console.error({
      error: { message: err, metaData: { name, ...properties } },
    });
  }
}

// Get buttons
function getElementById(id) {
  return document.getElementById(id);
}

const sendTest1 = getElementById("send-event-1");

// Attach Event Listeners
clickListenerToCIO(sendTest1)("event-1");

// Show Current Identifier
showIdentifierElements();
addClickListenerToResetIdentifierElements();