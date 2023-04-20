// Nave buttons and icons
const mobileNavBtn = document.querySelector('[aria-controls="mobile-menu"]');
const mobileNavClosedIcon = document.getElementById('nav-icon-closed-state');
const mobileNavOpenedIcon = document.getElementById('nav-icon-opened-state');
const mobileNavList = document.getElementById('mobile-nav');

// Update on click
mobileNavBtn.addEventListener("click", (e) => {
  mobileNavClosedIcon.classList.toggle("block");
  mobileNavClosedIcon.classList.toggle("hidden");
  mobileNavOpenedIcon.classList.toggle("block");
  mobileNavOpenedIcon.classList.toggle("hidden");
  mobileNavList.classList.toggle("block");
  mobileNavList.classList.toggle("hidden");
})