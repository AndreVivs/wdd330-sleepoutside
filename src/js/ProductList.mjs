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
    this.dataSource = dataSource; //productData("tents")
    this.listElement = listElement; //<ul class="product-list">
  }

  async init() {
    const list = await this.dataSource.getData(this.category);
    this.renderList(list);
    document.querySelector(".title").textContent =
      this.category.charAt(0).toUpperCase() + this.category.slice(1);
  }

  renderList(list) {
    // if (!this.listElement) {
    //   console.error("List element is not defined!");
    //   return;
    // }

    renderListWithTemplate(productCardTemplate, this.listElement, list);
  }
}
