import { renderListWithTemplate } from "./utils.mjs";

function productCardTemplate(product) {
  return `
    <li class="product-card">
        <a href="/product_pages/index.html?product=${product.Id}">
        <img src="${product.Images.PrimaryMedium}" alt="${product.Name}">
        <h2>${product.Brand.Name}</h2>
        <h3>${product.Name}</h3>
        <p class="product-card__price">$${product.FinalPrice}</p>
      </a>
    </li>
  `;
}

export default class ProductList {
  constructor(category, dataSource, listElement) {
    this.category = category; //Tents
    this.dataSource = dataSource; //ExternalServices("tents")
    this.listElement = listElement; //<ul class="product-list">
  }

  async init() {
    const list = await this.dataSource.getData(this.category);

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
    // if (!this.listElement) {
    //   console.error("List element is not defined!");
    //   return;
    // }

    renderListWithTemplate(productCardTemplate, this.listElement, list);
  }
}
