const mobileMenuBtnElement = document.getElementById("mobile-menu-btn"); // Built in method provided by Browser Side JS -- Also It is not available in NodeJS -- with this we are working with DOM (Only possible with browser)
const mobileMenuElement = document.getElementById("mobile-menu"); // DOM element

function toggleMobileMenu() {
  mobileMenuElement.classList.toggle("open");
  // toggle method -- it add css class if it doesnot exist and removes if it exists
  // helps to manipulate the CSS classes attached to the element
}

mobileMenuBtnElement.addEventListener("click", toggleMobileMenu); // just pointing the func executes only when it is clicked not when this line of code is parsed
