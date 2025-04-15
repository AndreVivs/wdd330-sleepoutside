import { loadHeaderFooter, updateCartCount } from "./utils.mjs";
import CheckoutProcess from "./CheckoutProcess.mjs";

document.addEventListener("DOMContentLoaded", () => {
  loadHeaderFooter().then(() => {
    updateCartCount();
  });

  const order = new CheckoutProcess("so-cart", "#order-summary");
  order.init();
  order.calculateOrderTotal();

  document
    .querySelector("#zip")
    .addEventListener("blur", order.calculateOrderTotal.bind(order));
});
