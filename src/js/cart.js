import {
  getLocalStorage,
  setLocalStorage,
  qs,
  loadHeaderFooter,
} from "./utils.mjs";

loadHeaderFooter();

function cartItemTemplate(item) {
  //const newItem =
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

  //return newItem;
}

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart") || [];
  const cartList = qs(".product-list");
  const cartFooter = qs(".cart-footer");
  const cartTotalElement = qs("#cartTotal");

  cartList.innerHTML = cartItems.map(cartItemTemplate).join("");

  if (cartItems.length > 0) {
    cartFooter.classList.remove("hideTotal");
    cartTotalElement.textContent = `$${calculateCartTotal(cartItems)}`;
  } else {
    cartFooter.classList.add("hideTotal");
  }

  cartList.addEventListener("click", updateQuantity); // Evento para + y -
  cartList.addEventListener("click", removeFromCart); // Evento para eliminar
}

renderCartContents();

function removeFromCart(event) {
  if (!event.target.classList.contains("cart-card__removeItem")) return;

  const productId = event.target.dataset.id;
  let cartItems = getLocalStorage("so-cart") || [];
  cartItems = cartItems.filter((item) => item.Id !== productId); // Filtrar y remover
  setLocalStorage("so-cart", cartItems);

  renderCartContents(); // Actualizar la vista del carrito
}

function updateQuantity(event) {
  const button = event.target;
  let cartItems = getLocalStorage("so-cart") || [];
  const productId = button.dataset.id;
  const productIndex = cartItems.findIndex((item) => item.Id === productId);

  if (productIndex === -1) return; // Si no encuentra el producto, salir

  if (button.classList.contains("increase")) {
    cartItems[productIndex].quantity += 1;
  } else if (button.classList.contains("decrease")) {
    if (cartItems[productIndex].quantity > 1) {
      cartItems[productIndex].quantity -= 1;
    }
  }

  setLocalStorage("so-cart", cartItems);
  renderCartContents(); // Refrescar carrito
}

function calculateCartTotal(cartItems) {
  return cartItems
    .reduce((total, item) => total + item.FinalPrice * item.quantity, 0)
    .toFixed(2);
}
