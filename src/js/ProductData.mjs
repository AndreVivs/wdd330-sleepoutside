function convertToJson(res) {
  if (res.ok) {
    return res.json();
  } else {
    throw new Error("Bad Response");
  }
}

export default class ProductData {
  constructor(category) {
    this.category = category;
    this.path = `/json/${this.category}.json`;
  }
  // async getData() {
  //   try {
  //     const response = await fetch(this.path);
  //     const data = await response.json();
  //     return data;
  //   } catch (error) {
  //     console.error("Error fetching product data:", error);
  //     return [];
  //   }
  // }
  async getData() {
    return await fetch(this.path)
      .then(convertToJson)
      .then((data) => data);
  }

  async findProductById(id) {
    const products = await this.getData();
    return products.find((item) => item.Id === id);
  }
}
