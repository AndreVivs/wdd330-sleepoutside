import { getLocalStorage, setLocalStorage, qs } from "./utils.mjs";

function cartItemTemplate(item) {
  const newItem = `<li class="cart-card divider">
  <a href="#" class="cart-card__image">
    <img
      src="${item.Image}"
      alt="${item.Name}"
    />
  </a>
  <a href="#">
    <h2 class="card__name">${item.Name}</h2>
  </a>
  <p class="cart-card__color">${item.Colors[0].ColorName}</p>
  <p class="cart-card__quantity">qty: 1</p>
  <p class="cart-card__price">$${item.FinalPrice}</p>
  <button class="remove-item" data-id="${item.Id}">❌</button>
  </li>`;

  return newItem;
}

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart");
  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  document.querySelector(".product-list").innerHTML = htmlItems.join("");

  const cartList = qs(".product-list");
  const cartFooter = qs(".cart-footer");
  const cartTotalElement = qs("#cartTotal");

  if (cartItems.length > 0) {
    cartFooter.classList.remove("hideTotal");
    cartTotalElement.textContent = calculateCartTotal(cartItems);
  } else {
    cartFooter.classList.add("hideTotal");
  }

  cartList.addEventListener("click", removeFromCart);
}

renderCartContents();

function removeFromCart(event) {
  if (!event.target.classList.contains("remove-item")) return;

  const productId = event.target.dataset.id;
  let cartItems = getLocalStorage("so-cart") || [];
  // Filtrar para remover el producto seleccionado
  cartItems = cartItems.filter((item) => item.Id !== productId);
  // Actualizar el localStorage
  setLocalStorage("so-cart", cartItems);

  renderCartContents();
}

function calculateCartTotal(cartItems) {
  return cartItems
    .reduce((total, item) => total + item.FinalPrice, 0)
    .toFixed(2);
}
