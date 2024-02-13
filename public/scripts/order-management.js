const updateOrderFormElements = document.querySelectorAll(
  ".order-actions form"
);

async function updateOrder(event) {
  event.preventDefault();
  const form = event.target;

  const formData = new FormData(form); // Built-in FormData object to extract the data of form easily
  const newStatus = formData.get("status");
  const orderId = formData.get("orderid");
  const csrfToken = formData.get("_csrf");

  let response;

  try {
    response = await fetch(`/admin/orders/${orderId}`, {
      method: "PATCH",
      body: JSON.stringify({
        newStatus: newStatus,
        _csrf: csrfToken,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    alert("Something went wrong - could not update order status.");
    return;
  }

  if (!response.ok) {
    alert("Something went wrong - could not update order status.");
    return;
  }

  const responseData = await response.json(); // Contains inforamtion about new status

  form.parentElement.parentElement.querySelector(".badge").textContent =
    responseData.newStatus.toUpperCase(); // Selected article then child element with class badge in it
}

for (const updateOrderFormElement of updateOrderFormElements) {
  updateOrderFormElement.addEventListener("submit", updateOrder);
}
