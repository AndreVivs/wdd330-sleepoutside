// wrapper for querySelector...returns matching element
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}
// or a more concise version if you are into that sort of thing:
// export const qs = (selector, parent = document) => parent.querySelector(selector);

// retrieve data from localstorage
export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}
// save data to local storage
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}
// set a listener for both touchend and click
export function setClick(selector, callback) {
  qs(selector).addEventListener("touchend", (event) => {
    event.preventDefault();
    callback();
  });
  qs(selector).addEventListener("click", callback);
}
// get the product id from the query string
export function getParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const product = urlParams.get(param);
  return product;
}

export function renderListWithTemplate(
  template,
  parentElement,
  list,
  position = "afterbegin",
  clear = false,
) {
  const htmlStrings = list.map(template);

  if (!parentElement) {
    console.error("Parent element is not defined!");
    return;
  }
  // Clear the contents if needed
  if (clear) {
    parentElement.innerHTML = "";
  }
  parentElement.insertAdjacentHTML(position, htmlStrings.join(""));
}

export function renderWithTemplate(template, parentElement, data, callback) {
  parentElement.innerHTML = template;
  if (callback) {
    callback(data);
  }
}

async function loadTemplate(path) {
  const res = await fetch(path);
  const template = await res.text();
  return template;
}

export async function loadHeaderFooter() {
  const headerTemplate = await loadTemplate("../partials/header.html");
  const footerTemplate = await loadTemplate("../partials/footer.html");

  const headerElement = document.querySelector("#main-header");
  const footerElement = document.querySelector("#main-footer");

  renderWithTemplate(headerTemplate, headerElement);
  renderWithTemplate(footerTemplate, footerElement);
}

function calculateCartTotal(cartItems) {
  return cartItems
    .reduce((total, item) => total + item.FinalPrice * item.quantity, 0)
    .toFixed(2);
}

export function renderCartContents() {
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
