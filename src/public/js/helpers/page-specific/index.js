window.addEventListener("load", () => {
  let identifier = window.functions.getIdentifier();
  let anonymousIdentifier = window.functions.getAnonymousID();
  document.getElementById(
    "show-url"
  ).innerHTML = `<em class="text-purple-500">${window.location.href}</em>`;
  if (identifier) {
    document.getElementById(
      "show-identifier"
    ).innerHTML = `<div class="p-2">Your Identifier is: <em class="text-purple-500">${identifier}</em></div>`;
  } else if (anonymousIdentifier) {
    document.getElementById(
      "show-identifier"
    ).innerHTML = `<div class="p-2">Your Anonymous ID: <em class="text-purple-500">${anonymousIdentifier}</em></div>`;
  }
});
