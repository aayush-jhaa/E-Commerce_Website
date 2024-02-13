const addToCartButtonElement = document.querySelector(
  "#product-details button"
);
const cartBadgeElements = document.querySelectorAll(".nav-items .badge"); // Gives first matchin item

async function addToCart() {
  // Sent post req to routes
  const productId = addToCartButtonElement.dataset.productid;
  const csrfToken = addToCartButtonElement.dataset.csrf;

  let response;
  try {
    response = await fetch("/cart/items", {
      method: "POST",
      body: JSON.stringify({
        productId: productId,
        _csrf: csrfToken,
      }), // Should be JSON format string
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    //Technical Error - Like we lost the connectivity while working
    alert("Something went wrong!");
    return;
  }

  if (!response.ok) {
    alert("Something went wrong!");
    return;
  }

  const responseData = await response.json(); // json() -- method exist on response object - method that decode data from json to regular

  const newTotalQuantity = responseData.newTotalItems;

  for (const cartBadgeElement of cartBadgeElements) {
    cartBadgeElement.textContent = newTotalQuantity;
  }
}

addToCartButtonElement.addEventListener("click", addToCart);
