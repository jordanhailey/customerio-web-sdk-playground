import { showIdentifierElements } from "../cio-helpers.js";

showIdentifierElements()
  .then(function identifierFound(){
    // Nave buttons and icons
    const mobileNavBtn = document.querySelector('[aria-controls="mobile-menu"]');
    const mobileNavClosedIcon = document.getElementById('nav-icon-closed-state');
    const mobileNavOpenedIcon = document.getElementById('nav-icon-opened-state');
    const mobileNavList = document.getElementById('mobile-nav');

    const desktopNavShowIdentifierBtn = document.querySelector('[aria-controls="show-identifier"]');
    desktopNavShowIdentifierBtn.classList.remove("invisible");
    const desktopNavShowIdentifier = document.querySelector('#desktop-nav-identifier');
    const desktopNavShowIdentifierQuestionIcon = document.querySelector('#question-icon');
    const desktopNavShowIdentifierIdentifierIcon = document.querySelector('#identifier-icon');

    // Update on click
    mobileNavBtn.addEventListener("click", (e) => {
      mobileNavClosedIcon.classList.toggle("block");
      mobileNavClosedIcon.classList.toggle("hidden");
      mobileNavOpenedIcon.classList.toggle("block");
      mobileNavOpenedIcon.classList.toggle("hidden");
      mobileNavList.classList.toggle("block");
      mobileNavList.classList.toggle("hidden");
    })
    desktopNavShowIdentifierBtn.addEventListener("click", (e) => {
      if (desktopNavShowIdentifier.classList.contains("hidden")) {
        desktopNavShowIdentifier.classList.replace("hidden","flex");
        desktopNavShowIdentifierQuestionIcon.classList.toggle("hidden")
        desktopNavShowIdentifierIdentifierIcon.classList.toggle("hidden")
      }
      else {
        desktopNavShowIdentifier.classList.replace("flex","hidden");
        desktopNavShowIdentifierQuestionIcon.classList.toggle("hidden")
        desktopNavShowIdentifierIdentifierIcon.classList.toggle("hidden")
    }
    })
  })
  .catch(function identifierNotFound(err){

  })