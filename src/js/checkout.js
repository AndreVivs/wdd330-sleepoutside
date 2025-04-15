import { loadHeaderFooter, updateCartCount } from "./utils.mjs";
import CheckoutProcess from "./CheckoutProcess.mjs";

document.addEventListener("DOMContentLoaded", () => {
  loadHeaderFooter().then(() => {
    updateCartCount();
  });

  const order = new CheckoutProcess("so-cart", "#order-summary");
  order.init();
  order.calculateOrderTotal(); // Mostrar resumen inmediatamente

  document
    .querySelector("#zip")
    .addEventListener("blur", order.calculateOrderTotal.bind(order));

  document.querySelector("#checkoutSubmit").addEventListener("click", (e) => {
    e.preventDefault();
    order.checkout();
  });
});
