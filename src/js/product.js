import { setLocalStorage, getLocalStorage } from "./utils.mjs";
import ProductData from "./ProductData.mjs";

const dataSource = new ProductData("tents");
const cartKey = "so-cart";

function addProductToCart(product) {
  if (!product) return;

  // Obtener carrito actual o inicializarlo como array si es null
  let cart = getLocalStorage(cartKey);
  if (!Array.isArray(cart)) cart = [];
  cart.push(product);
  // Guardar en localStorage
  setLocalStorage(cartKey, cart);
}

// add to cart button event handler
async function addToCartHandler(e) {
  const product = await dataSource.findProductById(e.target.dataset.id);
  addProductToCart(product);
}

// add listener to Add to Cart button
document
  .getElementById("addToCart")
  .addEventListener("click", addToCartHandler);
