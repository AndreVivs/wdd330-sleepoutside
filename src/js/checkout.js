import { loadHeaderFooter, updateCartCount } from "./utils.mjs";
import CheckoutProcess from "./CheckoutProcess.mjs";

document.addEventListener("DOMContentLoaded", () => {
  loadHeaderFooter().then(() => updateCartCount());

  const order = new CheckoutProcess("so-cart", "#order-summary");
  order.init();
  order.calculateOrderTotal();

  document
    .querySelector("#zip")
    .addEventListener("blur", order.calculateOrderTotal.bind(order));

  document.querySelector("#checkoutSubmit").addEventListener("click", (e) => {
    e.preventDefault();
    const form = document.querySelector("#checkout-form");

    const isValid = form.checkValidity();
    form.reportValidity();

    if (isValid) {
      order
        .checkout(form)
        .then((success) => {
          if (success) {
            localStorage.removeItem("so-cart");
            window.location.href = "success.html";
          }
        })
        .catch((err) => {
          console.error("Order failed:", err);
        });
    }
  });
});
