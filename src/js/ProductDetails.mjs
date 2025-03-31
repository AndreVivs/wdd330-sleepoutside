import { getLocalStorage, setLocalStorage } from "./utils.mjs";

export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = {};
    this.dataSource = dataSource;
  }

  async init() {
    const response = await this.dataSource.findProductById(this.productId);
    this.product = response?.Result || {}; // Extrae la propiedad Result

    this.renderProductDetails();
    // once the HTML is rendered, add a listener to the Add to Cart button
    // Notice the .bind(this). This callback will not work if the bind(this) is missing. Review the readings from this week on 'this' to understand why.
    const addToCartButton = document.getElementById("add-to-cart"); // Asegurar el ID correcto
    if (addToCartButton) {
      addToCartButton.addEventListener(
        "click",
        this.addProductToCart.bind(this),
      );
    } else {
      console.error("Error: Botton doesn't finded on DOM.");
    }
  }

  addProductToCart() {
    const cartItems = getLocalStorage("so-cart") || [];
    const existingProductIndex = cartItems.findIndex(
      (item) => item.Id === this.product.Id,
    );

    if (existingProductIndex !== -1) {
      // If the product exist the quantity increast by 1
      cartItems[existingProductIndex].quantity += 1;
      // alert(
      //   `${this.product.Name} is al ready in your cart. We add one quantity more.`,
      // );
      backpackInteraction();
    } else {
      // If the product doest't exist is added with quantity 1
      const newProduct = { ...this.product, quantity: 1 };
      cartItems.push(newProduct);
      ///alert(`${this.product.Name} has been added.`);
      backpackInteraction();
    }

    setLocalStorage("so-cart", cartItems);
    renderCartContents();
  }

  renderProductDetails() {
    productDetailsTemplate(this.product);
  }
}

function productDetailsTemplate(product) {
  if (!product || !product.Category) {
    console.error("Error: Producto no válido", product);
    return;
  }
  document.querySelector("h2").textContent =
    product.Category.charAt(0).toUpperCase() + product.Category.slice(1);
  document.querySelector("#p-brand").textContent = product.Brand.Name;
  document.querySelector("#p-name").textContent = product.NameWithoutBrand;

  const productImage = document.querySelector("#p-image");
  productImage.src = product.Images.PrimaryLarge;
  productImage.alt = product.NameWithoutBrand;
  const taxes = 1.0725;
  const price = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "USD",
  }).format(Number(product.FinalPrice) /* * taxes*/);
  document.querySelector("#p-price").textContent = `${price}`;
  document.querySelector("#p-color").textContent = product.Colors[0].ColorName;
  document.querySelector("#p-description").innerHTML =
    product.DescriptionHtmlSimple;

  document.querySelector("#add-to-cart").dataset.id = product.Id;
}

function backpackInteraction() {
  const svg = document.getElementById("icon");
  svg.classList.add("shake");

  setTimeout(() => {
    svg.classList.remove("shake");
  }, 1000);
}

//************* Alternative Display Product Details Method *******************/
// function productDetailsTemplate(product) {
//   return `<section class="product-detail">
//   <h3>${product.Brand.Name}</h3>
//     <h2 class="divider">${product.NameWithoutBrand}</h2>
//     <img
//       class="divider"
//       src="${product.Image}"
//       alt="${product.NameWithoutBrand}"
//     />
//     <p class="product-card__price">$${product.FinalPrice}</p>
//     <p class="product__color">${product.Colors[0].ColorName}</p>
//     <p class="product__description">
//     ${product.DescriptionHtmlSimple}
//     </p>
//     <div class="product-detail__add">
//       <button id="addToCart" data-id="${product.Id}">Add to Cart</button>
//     </div></section>`;
// }
