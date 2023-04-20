import { cdpGetIdentifier } from "../cdp-helpers.js";
import { cioShowIdentifierElements } from "../cio-helpers.js";

// Nave buttons and icons
const mobileNavBtn = document.querySelector('[aria-controls="mobile-menu"]');
const mobileNavClosedIcon = document.getElementById('nav-icon-closed-state');
const mobileNavOpenedIcon = document.getElementById('nav-icon-opened-state');
const mobileNavList = document.getElementById('mobile-nav');

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


const desktopNavShowIdentifierBtn = document.querySelector('[aria-controls="show-identifier"]')

// Since this button relies on JS, only show it when the JS loads
desktopNavShowIdentifierBtn.classList.remove("invisible");

function successfullyFoundID(id) {
  // console.log({id});
  // Identifer found
  desktopNavShowIdentifierBtn.classList.remove("cursor-wait");
  desktopNavShowIdentifierBtn.setAttribute("disabled","");
  desktopNavShowIdentifierBtn.classList.add("cursor-default");
  desktopNavShowIdentifierBtn.title = id.identifier ? "Your identifier current identifier is " + id.identifier : "Your identifier current anonymous identifier is " + id.anonymousIdentifier;
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
}

function fetchIdentifier(){
  desktopNavShowIdentifierBtn.setAttribute("disabled","")
  desktopNavShowIdentifierBtn.classList.add("cursor-wait");
    let timeout = setTimeout(()=>{
      desktopNavShowIdentifierBtn.removeAttribute("disabled")
    }, 1500)
    cioShowIdentifierElements()
      .then(function identifierFound(id){
        successfullyFoundID(id);
      })
      .catch(err=>{{
        cdpGetIdentifier().then(id=>{
          clearTimeout(timeout);
          successfullyFoundID(id);
        }).catch(e=>{
          console.error(e);
        })
      }})
}
fetchIdentifier();

desktopNavShowIdentifierBtn.addEventListener("click",fetchIdentifier)

// Without JS, I want the nav to not be sticky, this will add the class sticky when the JS loads
document.querySelectorAll("add-sticky").forEach(el=>{
  el.classList.add("sticky");
})