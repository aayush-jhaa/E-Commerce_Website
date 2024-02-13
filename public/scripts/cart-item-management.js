const cartItemUpdateFormElements = document.querySelectorAll(".cart-item-management");
const cartTotalPriceElement = document.getElementById("cart-total-price");
const cartBadgeElements = document.querySelectorAll(".nav-items .badge");

async function updateCartItem(event) {
  event.preventDefault();

  const form = event.target;

  const productId = form.dataset.productid;
  const csrfToken = form.dataset.csrf;
  const quantity = form.firstElementChild.value;
  // Now we sufficent data to sent request
  let response;

  try {
    response = await fetch("/cart/items", {
      method: "PATCH",
      body: JSON.stringify({
        productId: productId,
        quantity: quantity, // same as Key name incontroller to extract the data
        _csrf: csrfToken,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    alert("Something went wrong!");
    return;
  }

  if (!response.ok) {
    alert("Something went wrong!"); // That is no technical problem but error status code!
    return;
  }

  const responseData = await response.json();

  if (responseData.updatedCartData.updatedItemPrice === 0) {
    form.parentElement.parentElement.remove();
  } else {
    // Now we update the DOM -- Total Price and badge number
    //Here I'm selecting items when i need them instead right at the beginning
    //Bcoz this element depends on the exact form for which event was caused
    const cartItemTotalPriceElement = form.parentElement.querySelector(".cart-item-price");
    cartItemTotalPriceElement.textContent = responseData.updatedCartData.updatedItemPrice.toFixed(2);
  }

  cartTotalPriceElement.textContent = responseData.updatedCartData.newTotalPrice.toFixed(2);

  for(const cartBadgeElement of cartBadgeElements) {
    cartBadgeElement.textContent = responseData.updatedCartData.newTotalQuantity;
  }
}

for (const formElement of cartItemUpdateFormElements) {
  formElement.addEventListener("submit", updateCartItem); // Listening for submit events for every item means every form
}
