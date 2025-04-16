import { getLocalStorage, setLocalStorage } from "./utils.mjs";
import { alertMessage } from "./utils.mjs";

export default class Wishlist {
  constructor(wishlistElement) {
    this.wishlistElement = wishlistElement;
  }

  async init() {
    const wishlist = getLocalStorage("so-wishlist") || [];
    if (wishlist.length === 0) {
      this.wishlistElement.innerHTML = "<p>Your wishlist is empty.</p>";
      return;
    }
    this.renderWishlist(wishlist);
  }

  renderWishlist(wishlist) {
    this.wishlistElement.innerHTML = "";

    wishlist.forEach((product) => {
      const li = document.createElement("li");
      li.classList.add("wishlist-item");
      li.innerHTML = `
        <a href="/product_pages/index.html?product=${product.Id}">
          <img src="${product.Images.PrimaryMedium}" alt="${product.Name}">
          <h3>${product.Name}</h3>
          <p>$${product.FinalPrice}</p>
        </a>
        <button data-id="${product.Id}" class="remove-wishlist">Remove</button>
      `;
      this.wishlistElement.appendChild(li);
    });

    this.attachRemoveListeners();
  }

  attachRemoveListeners() {
    const buttons = this.wishlistElement.querySelectorAll(".remove-wishlist");
    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.id;
        this.removeFromWishlist(id);
      });
    });
  }

  removeFromWishlist(id) {
    let wishlist = getLocalStorage("so-wishlist") || [];
    wishlist = wishlist.filter(
      (product) => product.Id.toString() !== id.toString()
    );
    setLocalStorage("so-wishlist", wishlist);
    alertMessage("Item removed from your wishlist.");
    this.init(); // Recargar la vista con la nueva data
  }
}
