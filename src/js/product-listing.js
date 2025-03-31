import { loadHeaderFooter, getParam, updateCartCount } from "./utils.mjs";
import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";

document.addEventListener("DOMContentLoaded", () => {
  loadHeaderFooter().then(() => {
    updateCartCount();
  });
});

const category = getParam("category");
const dataSource = new ProductData();
const element = document.querySelector(".product-list");
const listing = new ProductList(category, dataSource, element);

listing.init();
