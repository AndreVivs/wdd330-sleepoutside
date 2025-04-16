import {
  renderListWithTemplate,
  getLocalStorage,
  alertMessage,
  setLocalStorage,
} from "./utils.mjs";

function productCardTemplate(product) {
  return `
    <li class="product-card">
        <a href="/product_pages/index.html?product=${product.Id}">
        <img src="${product.Images.PrimaryMedium}" alt="${product.Name}">
        <h2>${product.Brand.Name}</h2>
        <h3>${product.Name}</h3>
        <p class="product-card__price">$${product.FinalPrice}</p>
      </a>
      <button data-id="${product.Id}" class="wishlist-btn">♡ Add to Wishlist</button>
    </li>
  `;
}

export default class ProductList {
  constructor(category, dataSource, listElement) {
    this.category = category; //Tents
    this.dataSource = dataSource; //ExternalServices("tents")
    this.listElement = listElement; //<ul class="product-list">
    this.data = [];
  }

  async init() {
    const list = await this.dataSource.getData(this.category);
    this.data = list;
    this.renderList(list);
    //this.cleanWishlistStorage();
    this.addItemToWishlist();

    const sortSelect = document.getElementById("sort");
    if (sortSelect.value === "noSort" || sortSelect.value === "default") {
      this.renderList(list);
    }

    sortSelect.addEventListener("change", (event) => {
      if (sortSelect.value === "noSort" || sortSelect.value === "default") {
        this.renderList(list);
      } else if (sortSelect && sortSelect.value !== "noSort") {
        this.listElement.innerHTML = "";
        this.sortList(event.target.value, list);
      }
    });

    document.querySelector(".title").textContent =
      this.category.charAt(0).toUpperCase() + this.category.slice(1);
  }

  sortList(criteria, list) {
    let sortedList = [...list];

    if (criteria === "nameAZ") {
      sortedList.sort((a, b) => a.Name.localeCompare(b.Name));
    } else if (criteria === "nameZA") {
      sortedList.sort((a, b) => b.Name.localeCompare(a.Name));
    } else if (criteria === "lowPrice") {
      sortedList.sort((a, b) => a.FinalPrice - b.FinalPrice);
    } else if (criteria === "highPrice") {
      sortedList.sort((a, b) => b.FinalPrice - a.FinalPrice);
    }

    this.renderList(sortedList);
  }

  renderList(list) {
    renderListWithTemplate(productCardTemplate, this.listElement, list);
  }

  // cleanWishlistStorage() {
  //   let wishlist = getLocalStorage("so-wishlist") || [];
  //   wishlist = wishlist.filter((item) => item && item.Id); // Filtra solo los productos válidos
  //   setLocalStorage("so-wishlist", wishlist); // Actualiza el localStorage
  // }

  addItemToWishlist() {
    setTimeout(() => {
      const wishlistButtons =
        this.listElement.querySelectorAll(".wishlist-btn");
      let wishlist = getLocalStorage("so-wishlist") || [];

      wishlistButtons.forEach((btn) => {
        const id = (btn.dataset.id || btn.value).toString();

        // Marca el botón si ya está en wishlist
        if (wishlist.some((item) => item?.Id?.toString() === id)) {
          btn.textContent = "✓ In Wishlist";
          btn.classList.add("active");
        }

        btn.addEventListener("click", () => {
          const product = this.data.find((item) => item.Id.toString() === id);

          if (product) {
            // Verifica si el producto ya está en el wishlist
            if (!wishlist.some((item) => item?.Id?.toString() === id)) {
              wishlist.push(product);
              setLocalStorage("so-wishlist", wishlist);

              btn.textContent = "✓ In Wishlist";
              btn.classList.add("active");
              alertMessage("Item added to your wishlist");
            } else {
              alertMessage("It's already on your Wishlist");
            }
          }
        });
      });
    }, 1000);
  }
}
