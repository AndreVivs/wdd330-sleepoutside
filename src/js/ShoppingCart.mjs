import {
  getLocalStorage,
  setLocalStorage,
  qs,
  renderListWithTemplate,
} from "./utils.mjs";

function cartItemTemplate(item) {
  return `<li class="cart-card divider">
    <a href="#" class="cart-card__image">
      <img src="${item.Image}" alt="${item.Name}" />
    </a>
    <div class="cart-card__details">
      <a href="#"><h2 class="card__name">${item.Name}</h2></a>
      <p class="cart-card__color">${item.Colors[0].ColorName}</p>
    </div>
    <p class="cart-card__price">$${(item.FinalPrice * item.quantity).toFixed(2)}</p>
    <button class="cart-card__removeItem" data-id="${item.Id}">🗑️</button>
    <div class="quantity-container">
      <button class="quantity-btn decrease" data-id="${item.Id}">-</button>
      <input type="number" class="quantity-input" value="${item.quantity}" min="1" data-id="${item.Id}">
      <button class="quantity-btn increase" data-id="${item.Id}">+</button>
    </div>
  </li>`;
}

export default class ShoppingCart {
  constructor(cartElement, footerElement, totalElement) {
    this.cartElement = qs(cartElement);
    this.footerElement = qs(footerElement);
    this.totalElement = qs(totalElement);
  }

  init() {
    this.renderCartContents();
    this.cartElement.addEventListener("click", (event) =>
      this.handleCartActions(event),
    );
  }

  renderCartContents() {
    const cartItems = getLocalStorage("so-cart") || [];
    renderListWithTemplate(
      cartItemTemplate,
      this.cartElement,
      cartItems,
      "afterbegin",
      true,
    );

    if (cartItems.length > 0) {
      this.footerElement.classList.remove("hideTotal");
      this.totalElement.textContent = `$${this.calculateCartTotal(cartItems)}`;
    } else {
      this.footerElement.classList.add("hideTotal");
    }
  }

  handleCartActions(event) {
    if (event.target.classList.contains("cart-card__removeItem")) {
      this.removeFromCart(event.target.dataset.id);
    } else if (
      event.target.classList.contains("increase") ||
      event.target.classList.contains("decrease")
    ) {
      this.updateQuantity(event.target);
    }
  }

  removeFromCart(productId) {
    let cartItems = getLocalStorage("so-cart") || [];
    cartItems = cartItems.filter((item) => item.Id !== productId);
    setLocalStorage("so-cart", cartItems);
    this.renderCartContents();
  }

  updateQuantity(button) {
    let cartItems = getLocalStorage("so-cart") || [];
    const productId = button.dataset.id;
    const productIndex = cartItems.findIndex((item) => item.Id === productId);

    if (productIndex === -1) return;

    if (button.classList.contains("increase")) {
      cartItems[productIndex].quantity += 1;
    } else if (
      button.classList.contains("decrease") &&
      cartItems[productIndex].quantity > 1
    ) {
      cartItems[productIndex].quantity -= 1;
    }

    setLocalStorage("so-cart", cartItems);
    this.renderCartContents();
  }

  calculateCartTotal(cartItems) {
    return cartItems
      .reduce((total, item) => total + item.FinalPrice * item.quantity, 0)
      .toFixed(2);
  }
}
