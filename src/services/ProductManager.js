import { promises as fs } from "fs";
import { Products } from "../models/ProductsMongoose.js"; // Importar la clase Products

// Definición de la clase ProductManager
export class ProductManager {
  constructor() {
    // Ruta del archivo JSON que almacenará los productos
    this.path = "./products.json";
    // Crear una instancia de la clase Products
    this.productsInstance = new Products(this.path);
  }

  // Método para agregar un nuevo producto
  async addProduct(productData) {
    // Obtener el nuevo producto utilizando el método 'con' de la clase Products
    const newProduct = this.productsInstance.con(productData);

    // Obtener la lista actual de productos desde el archivo utilizando la instancia de Products
    const currentProducts = await this.productsInstance.getProducts();

    // Agregar el nuevo producto a la lista
    currentProducts.push(newProduct);

    // Escribir la lista actualizada de productos en el archivo JSON
    await fs.writeFile(this.path, JSON.stringify(currentProducts));

    // Devolver el nuevo producto agregado
    return newProduct;
  }

  // Método para obtener un producto por su ID
  async getProductById(id) {
    // Obtener la lista completa de productos utilizando la instancia de Products
    const productList = await this.productsInstance.getProducts();

    // Buscar el producto con el ID proporcionado
    const product = productList.find((product) => product.id === id);

    // Devolver el producto si se encuentra, de lo contrario, imprimir un mensaje
    if (product) {
      return product;
    } else {
      console.log("Producto no encontrado");
    }
  }

  // Método para obtener todos los productos
  async getAll() {
    // Reutilizar el método 'toPOJO' de la clase Products para obtener todos los productos
    const productList = await this.productsInstance.getProducts();
    return this.productsInstance.toPOJO(productList);
  }

  // Método para actualizar un producto por su ID
  async updateProduct(id, updatedData) {
    // Obtener la lista actual de productos utilizando la instancia de Products
    const products = await this.productsInstance.getProducts();

    // Encontrar el índice del producto que se actualizará
    const index = products.findIndex((product) => product.id === id);

    // Actualizar el producto si se encuentra, de lo contrario, imprimir un mensaje
    if (index !== -1) {
      products[index] = this.productsInstance.con({ id, ...updatedData });

      // Escribir la lista actualizada de productos en el archivo JSON
      await fs.writeFile(this.path, JSON.stringify(products));

      // Devolver el producto actualizado
      return products[index];
    } else {
      console.log("Producto no encontrado");
    }
  }

  // Método para eliminar un producto por su ID
  async deleteProduct(id) {
    // Obtener la lista actual de productos utilizando la instancia de Products
    const products = await this.productsInstance.getProducts();

    // Encontrar el índice del producto que se eliminará
    const index = products.findIndex((product) => product.id === id);

    // Eliminar el producto si se encuentra, de lo contrario, imprimir un mensaje
    if (index !== -1) {
      products.splice(index, 1);

      // Escribir la lista actualizada de productos en el archivo JSON
      await fs.writeFile(this.path, JSON.stringify(products));
    } else {
      console.log("Producto no encontrado");
    }
  }
}
