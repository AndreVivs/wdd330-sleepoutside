import { getLocalStorage } from "./utils.mjs";

function packageItems(items) {
  return items.map((item) => ({
    id: item.Id,
    price: item.FinalPrice,
    name: item.Name,
    quantity: item.quantity ?? 1,
  }));
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
    this.orderTotal =
      parseFloat(this.itemTotal) +
      parseFloat(this.tax) +
      parseFloat(this.shipping);

    this.displayOrderTotals();
  }

  displayOrderTotals() {
    const summaryContainer = document.querySelector("#order-summary");

    const totalItems = this.list.reduce((sum, item) => {
      const quantity = item.quantity ?? 1;
      return sum + quantity;
    }, 0);

    summaryContainer.innerHTML = `
      <p><strong>Items:</strong> <span id="num-items" required>${totalItems}</span></p>
      <p><strong>Subtotal:</strong> <span id="cartTotal" required>$${this.itemTotal.toFixed(2)}</span></p>
      <p><strong>Tax:</strong> <span id="tax" required>$${this.tax.toFixed(2)}</span></p>
      <p><strong>Shipping:</strong> <span id="shipping" required>$${this.shipping.toFixed(2)}</span></p>
      <p><strong>Total:</strong> <span id="orderTotal" required>$${this.orderTotal.toFixed(2)}</span></p>
    `;
  }

  initFormHandler() {
    const form = document.querySelector("#checkout-form");
    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();

        // Aquí podrías enviar los datos a un servidor, pero por ahora solo mostraremos un mensaje.
        alert("Order submitted! ✅\nTotal: $" + this.orderTotal.toFixed(2));

        // Si quieres limpiar localStorage y redirigir:
        localStorage.removeItem(this.key);
        form.reset();
        const summaryContainer = document.querySelector("#order-summary");
        summaryContainer.innerHTML = "<p>Thank you for your purchase!</p>";
      });
    }
  }
}
