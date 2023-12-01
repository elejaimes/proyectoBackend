import { Products, ProductModel } from "../models/ProductsMongoose.js";

// Clase ProductManager actualizada para usar Mongoose
export class ProductManagerMongoDb {
  constructor() {
    // No necesitas especificar la ruta del archivo JSON, ya que ahora usas MongoDB
    // Elimina la línea this.path = "./products.json";
    this.productsInstance = new Products();
  }

  async addProduct(productData) {
    // Obtener el nuevo producto utilizando el método 'con' de la clase Products
    const newProduct = await this.productsInstance.con(productData);

    // Crear un nuevo documento en la colección MongoDB usando Mongoose
    const createdProduct = await ProductModel.create(newProduct);

    // Devolver el nuevo producto agregado
    return createdProduct;
  }

  async getProductById(id) {
    // Obtener un producto por su ID desde la base de datos MongoDB
    const product = await ProductModel.findById(id);

    // Devolver el producto si se encuentra, de lo contrario, imprimir un mensaje
    if (product) {
      return product;
    } else {
      console.log("Producto no encontrado");
    }
  }

  async getAll() {
    // Obtener todos los productos desde la base de datos MongoDB
    const productList = await ProductModel.find();
    return this.productsInstance.toPOJO(productList);
  }

  async updateProduct(id, updatedData) {
    // Actualizar un producto por su ID en la base de datos MongoDB
    const updatedProduct = await ProductModel.findByIdAndUpdate(
      id,
      updatedData,
      { new: true }
    );

    // Devolver el producto actualizado
    return updatedProduct;
  }

  async deleteProduct(id) {
    // Eliminar un producto por su ID de la base de datos MongoDB
    const deletedProduct = await ProductModel.findByIdAndDelete(id);

    // Manejar el caso en que el producto no se encuentra
    if (!deletedProduct) {
      console.log("Producto no encontrado");
    }
  }
}
