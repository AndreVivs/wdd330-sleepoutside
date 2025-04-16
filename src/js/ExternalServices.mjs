const baseURL = import.meta.env.VITE_SERVER_URL;
const URL = import.meta.env.VITE_CHECKOUT_URL;

function convertToJson(res) {
  if (res.ok) {
    return res.json();
  } else {
    throw new Error("Bad Response");
  }
}

export default class ExternalServices {
  async getData(category) {
    const response = await fetch(`${baseURL}products/search/${category} `);
    const data = await convertToJson(response);
    return data.Result;
  }

  async findProductById(id) {
    try {
      const response = await fetch(`${baseURL}product/${id}`);
      if (!response.ok) {
        throw new Error(`Error fetching product with ID ${id}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Failed to fetch product details:", error);
      return null;
    }
  }

  async submitOrder(order) {
    const url = `${URL}`;
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(order),
    };
    console.log("Sending order to backend:", order);
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error("Failed to submit order");
    }

    return await response.json();
  }
}
