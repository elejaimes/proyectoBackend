import { promises as fs } from "fs";
import { v4 as uuidv4 } from "uuid";

export class CartManager {
  constructor() {
    this.path = "./cart.json";
    this.cart = [];
  }

  getCarts = async () => {
    const response = await fs.readFile(this.path, "utf-8");
    const responseJSON = JSON.parse(response);
    return responseJSON;
  };

  getCartProducts = async (id) => {
    const carts = await this.getCarts();

    const cart = carts.find((cart) => cart.id === id);
    if (cart) {
      return cart.products;
    } else {
      console.log("Carrito no encontrado");
    }
  };

  newCart = async () => {
    const id = uuidv4();

    const newCart = { id, products: [] };

    this.cart = await this.getCarts();
    this.cart.push(newCart);

    await fs.writeFile(this.path, JSON.stringify(this.cart));
    return newCart;
  };

  addProductToCart = async (cart_id, product_id) => {
    const carts = await this.getCarts();
    const index = carts.findIndex((cart) => cart.id === cart_id);
    if (index !== -1) {
      const cartProducts = await this.getCartProducts(cart_id);
      const existingProductIndex = cartProducts.findIndex(
        (product) => product.product_id === product_id
      );
      if (existingProductIndex !== -1) {
        cartProducts[existingProductIndex].quantity =
          cartProducts[existingProductIndex].quantity + 1;
      } else {
        cartProducts.push({ product_id, quantity: 1 });
      }

      carts[index].products = cartProducts;

      await fs.writeFile(this.path, JSON.stringify(carts));
      console.log("Producto agregado con éxito");
    } else {
      console.log("Carrito no encontrado");
    }
  };
}
