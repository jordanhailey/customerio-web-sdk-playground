import { getIdentifier, getAnonymousID, showIdentifierElements } from "../cio-helpers.js";

export default function index() {
  document.getElementById("show-url").innerHTML = `<em class="text-purple-500 font-bold">${window.location.href}</em>`;
  const showIdentifier = document.getElementById("show-identifier");
  let intervalAttempt = 0;
  showIdentifierElements()
}
