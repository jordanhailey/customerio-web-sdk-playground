import { getIdentifier, getAnonymousID, showIdentifierElements, addClickListenerToResetIdentifierElements } from "../cio-helpers.js";
showIdentifierElements()
addClickListenerToResetIdentifierElements()

document.getElementById("show-url").innerHTML = `<em class="text-purple-500 font-bold">${window.location.href}</em>`;
const showIdentifier = document.getElementById("show-identifier");
let intervalAttempt = 0;


