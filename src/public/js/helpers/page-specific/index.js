import { getIdentifier, getAnonymousID } from "../cio-helpers.js";

document.getElementById("show-url").innerHTML = `<em class="text-purple-500">${window.location.href}</em>`;
const showIdentifier = document.getElementById("show-identifier");
let intervalAttempt = 0;

let cioLoadedInterval = setInterval(()=>{
  intervalAttempt++
  let identifier = getIdentifier();
  let anonymousIdentifier = getAnonymousID();
  if (identifier) {
    showIdentifier.innerHTML = `<div class="p-2">Your Identifier is: <em class="text-purple-500">${identifier}</em></div>`;
    clearInterval(cioLoadedInterval)
  } else if (anonymousIdentifier) {
    showIdentifier.innerHTML = `<div class="p-2">Your Anonymous ID: <em class="text-purple-500">${anonymousIdentifier}</em></div>`;
    clearInterval(cioLoadedInterval)
  }
  // If not found, continue attempting every ~10ms for about 1 second
  if (intervalAttempt > 100) {
    console.warn("no identifier found")
    clearInterval(cioLoadedInterval)
  }
},10)
