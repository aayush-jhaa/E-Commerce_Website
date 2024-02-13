//Listen to click events -- different delete button different items
// querySelectorAll gives array of all matched elements
const deleteProductButtonElements = document.querySelectorAll(
  ".product-item button"
);

async function deleteProduct(event) {
  const buttonElement = event.target; // target- element on which event is occured
  const productId = buttonElement.dataset.productid;
  const csrfToken = buttonElement.dataset.csrf;

  // Sent this request to the backend
  // Axios orr different way fetch()
  // domain should be added if different server hosting this domain

  const response = await fetch(
    "/admin/products/" + productId + "?_csrf=" + csrfToken,
    {
      method: "DELETE", // Configuring the method
    }
  );

  if (!response.ok) {
    alert("Something went wrong!");
    return;
  } // Status is not 200

  // Response is ok
  // Updating DOM -- Using DOM traversal
  // Drawback -- if nesting changes we need to update the JS code

  buttonElement.parentElement.parentElement.parentElement.parentElement.remove(); //remove() -- built in method // button --> div(parent) --> div --> article --> li
}

for (const deleteProductButtonElement of deleteProductButtonElements) {
  deleteProductButtonElement.addEventListener("click", deleteProduct);
}
