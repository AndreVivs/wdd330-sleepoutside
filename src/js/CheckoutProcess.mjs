import { getLocalStorage } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";

function packageItems(items) {
  return items.map((item) => ({
    id: item.Id,
    name: item.Name,
    price: item.FinalPrice,
    quantity: item.quantity ?? 1,
  }));
}

function formDataToJSON(formElement) {
  const formData = new FormData(formElement);
  const obj = {};
  formData.forEach((value, key) => {
    obj[key] = value;
  });
  return obj;
}

export default class CheckoutProcess {
  constructor(key, outputSelector) {
    this.key = key;
    this.outputSelector = outputSelector;
    this.list = [];
    this.itemTotal = 0;
    this.shipping = 0;
    this.tax = 0;
    this.orderTotal = 0;
    // this.expiration = 0;
    // this.code = 0;
  }

  init() {
    const rawList = getLocalStorage(this.key) ?? [];
    this.list = packageItems(rawList);
    this.calculateItemSummary();
    this.calculateOrderTotal();
    this.initFormHandler();
  }

  calculateItemSummary() {
    const amounts = this.list.map((item) => {
      const quantity = item.quantity ?? 1;
      return item.price * quantity;
    });
    this.itemTotal = amounts.reduce((sum, item) => sum + item, 0);
  }

  calculateOrderTotal() {
    const totalQuantity = this.list.reduce(
      (sum, item) => sum + item.quantity,
      0,
    );
    this.tax = this.itemTotal * 0.06;
    this.shipping = 10 + (totalQuantity - 1) * 2;
    this.orderTotal = this.itemTotal + this.tax + this.shipping;
    this.displayOrderTotals();
  }

  displayOrderTotals() {
    const summaryContainer = document.querySelector("#order-summary");
    const totalItems = this.list.reduce(
      (sum, item) => sum + (item.quantity ?? 1),
      0,
    );

    summaryContainer.innerHTML = `
      <p><strong>Items:</strong> <span id="num-items">${totalItems}</span></p>
      <p><strong>Subtotal:</strong> <span id="cartTotal">$${this.itemTotal.toFixed(2)}</span></p>
      <p><strong>Tax:</strong> <span id="tax">$${this.tax.toFixed(2)}</span></p>
      <p><strong>Shipping:</strong> <span id="shipping">$${this.shipping.toFixed(2)}</span></p>
      <p><strong>Total:</strong> <span id="orderTotal">$${this.orderTotal.toFixed(2)}</span></p>
    `;
  }

  initFormHandler() {
    const form = document.querySelector("#checkout-form");
    if (form) {
      form.addEventListener("submit", async (e) => {
        e.preventDefault();

        try {
          const result = await this.checkout(form);
          alert("Order submitted successfully!");

          // limpiar carrito y formulario
          localStorage.removeItem(this.key);
          form.reset();
          document.querySelector("#order-summary").innerHTML =
            "<p>Thank you for your purchase!</p>";
        } catch (error) {
          console.error("Checkout failed:", error);
          alert("There was a problem submitting your order.");
        }
      });
    }
  }

  async checkout(form) {
    const order = formDataToJSON(form);

    // Extraer los valores de 'expiration' y 'code' desde el formulario
    order.expiration = form.querySelector("#expiration").value;
    order.code = form.querySelector("#code").value;

    // Asegúrate de que estos valores sean correctos
    console.log("Expiration:", order.expiration);
    console.log("CVV:", order.code);

    // Otros campos de la orden
    order.orderDate = new Date().toISOString();
    order.orderTotal = this.orderTotal.toFixed(2);
    order.tax = this.tax;
    order.shipping = this.shipping;
    order.items = this.list;

    console.log(
      "Sending clean order to backend:",
      JSON.stringify(order, null, 2),
    );

    const service = new ExternalServices();
    return await service.submitOrder(order);
  }
}
