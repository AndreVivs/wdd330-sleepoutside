import {
  loadHeaderFooter,
  updateCartCount,
  getLocalStorage,
} from "./utils.mjs";
import Wishlist from "./WishListFile.mjs";

document.addEventListener("DOMContentLoaded", async () => {
  await loadHeaderFooter();
  updateCartCount();

  const wishlistElement = document.querySelector(".wishlist-list");
  if (wishlistElement) {
    const wishlist = new Wishlist(wishlistElement);
    wishlist.init();
  } else {
    console.error("No se encontró el contenedor para la wishlist.");
  }
});
