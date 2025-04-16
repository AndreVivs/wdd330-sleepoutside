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
  }

  init() {
    const rawList = getLocalStorage(this.key) ?? [];
    this.list = packageItems(rawList);
    this.calculateItemSummary();
    this.calculateOrderTotal();
    // this.initFormHandler();
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

  // initFormHandler() {
  //   const form = document.querySelector("#checkout-form");
  //   const summaryContainer = document.querySelector("#order-summary");

  //   if (form) {
  //     form.addEventListener("submit", async (e) => {
  //       e.preventDefault();

  //       // Validar campos vacíos
  //       const requiredFields = form.querySelectorAll("input[required]");
  //       const emptyFields = Array.from(requiredFields).filter(
  //         (field) => !field.value.trim(),
  //       );

  //       const itemTotal = this.itemTotal;
  //       const tax = this.tax;
  //       const shipping = this.shipping;
  //       const orderTotal = this.orderTotal;

  //       const summaryInvalid =
  //         itemTotal <= 0 || tax <= 0 || shipping <= 0 || orderTotal <= 0;

  //       if (emptyFields.length > 0 || summaryInvalid) {
  //         const messages = [];

  //         if (emptyFields.length > 0) {
  //           messages.push("Please fill in all required fields.");
  //         }

  //         if (summaryInvalid) {
  //           messages.push("Invalid order summary. Please check your cart.");
  //         }

  //         console.log("Error messages:", messages);
  //         this.displayCheckoutError(messages);
  //         return; // No continuar con el envío
  //       }

  //       try {
  //         const result = await this.checkout(form);
  //         if (result) {
  //           localStorage.removeItem(this.key);
  //           form.reset();
  //           summaryContainer.innerHTML = "";
  //           this.displayCheckoutError("");
  //           window.location.href = "./success.html";
  //         }
  //       } catch (error) {
  //         console.error("Checkout failed:", error);
  //         alert("There was a problem submitting your order.");
  //       }
  //     });
  //   }
  // }

  async checkout(form) {
    const order = formDataToJSON(form);

    order.expiration = form.querySelector("#expiration").value;
    order.code = form.querySelector("#code").value;
    order.orderDate = new Date().toISOString();
    order.orderTotal = this.orderTotal.toFixed(2);
    order.tax = this.tax;
    order.shipping = this.shipping;
    order.items = this.list;

    console.log(
      "Sending clean order to backend:",
      JSON.stringify(order, null, 2),
    );

    try {
      const service = new ExternalServices();
      const confirmation = await service.submitOrder(order);
      console.log("Order confirmation:", confirmation);
      return true;
    } catch (error) {
      console.error("Error during checkout:", error);
      if (error.name === "servicesError") {
        const errorMessages = Object.values(error.message); // Extrae todos los mensajes
        this.displayCheckoutError(errorMessages);
      } else {
        this.displayCheckoutError([
          "Unknown error occurred. Please try again.",
        ]);
      }
      return false;
    }
  }

  displayCheckoutError(errorMessages) {
    const errorBox = document.getElementById("checkoutError");
    errorBox.innerHTML = "";

    if (Array.isArray(errorMessages)) {
      const ul = document.createElement("ul");
      errorMessages.forEach((msg) => {
        const li = document.createElement("li");
        li.innerText = msg;
        ul.appendChild(li);
      });
      errorBox.appendChild(ul);
    } else {
      errorBox.innerText = errorMessages || "An error occurred.";
    }

    errorBox.style.display = "block";
    errorBox.style.color = "red";
  }
}
