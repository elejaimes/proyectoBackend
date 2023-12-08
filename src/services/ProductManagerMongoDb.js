// import { Products, ProductModel } from "../models/ProductsMongoose.js";
// import { v4 as uuidv4 } from "uuid";

// // Clase ProductManager actualizada para usar Mongoose
// export class ProductManagerMongoDb {
//   constructor() {
//     // No necesitas especificar la ruta del archivo JSON, ya que ahora usas MongoDB
//     // Elimina la línea this.path = "./products.json";
//     this.productsInstance = new Products();
//   }

//   async addProduct(productData) {
//     try {
//       // Generar un nuevo _id único utilizando la biblioteca uuid
//       const newId = uuidv4();

//       // Asignar el nuevo _id al objeto productData
//       productData._id = newId;

//       // Crear un nuevo documento en la colección MongoDB usando Mongoose
//       const createdProduct = await ProductModel.create(productData);

//       // Devolver el nuevo producto agregado
//       return createdProduct;
//     } catch (error) {
//       throw new Error(`Error al agregar el producto: ${error.message}`);
//     }
//   }

//   async getProductById(id) {
//     // Obtener un producto por su ID desde la base de datos MongoDB
//     const product = await ProductModel.findById(id);

//     // Devolver el producto si se encuentra, de lo contrario, imprimir un mensaje
//     if (product) {
//       return product;
//     } else {
//       console.log("Producto no encontrado");
//     }
//   }

//   async getAll() {
//     // Obtener todos los productos desde la base de datos MongoDB
//     const productList = await ProductModel.find();
//     return this.productsInstance.toPOJO(productList);
//   }

//   async updateProduct(id, updatedData) {
//     // Actualizar un producto por su ID en la base de datos MongoDB
//     const updatedProduct = await ProductModel.findByIdAndUpdate(
//       id,
//       updatedData,
//       { new: true }
//     );

//     // Devolver el producto actualizado
//     return updatedProduct;
//   }

//   async deleteProduct(id) {
//     // Eliminar un producto por su ID de la base de datos MongoDB
//     const deletedProduct = await ProductModel.findByIdAndDelete(id);

//     // Manejar el caso en que el producto no se encuentra
//     if (!deletedProduct) {
//       console.log("Producto no encontrado");
//     }
//   }
// }
