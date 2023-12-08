import { Schema, model } from "mongoose";
import { randomUUID } from "crypto";

// Define el esquema de los productos
const productSchema = new Schema(
  {
    _id: { type: String, default: randomUUID(), required: true, unique: true },
    title: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    price: { type: Number, required: true },
    status: { type: Boolean, default: true },
    stock: { type: Number, required: true },
    category: { type: String, required: true },
    photoUrl: { type: String, default: "static/imgs/fotoGenerica.png" },
  },
  {
    strict: "throw",
    versionKey: false,
  }
);

// Define el modelo de productos y se exporta
export const ProductModel = model("products", productSchema);

// import { Schema, model } from "mongoose";

// // Define el esquema de los productos
// const productSchema = new Schema(
//   {
//     _id: { type: String, required: true, unique: true },
//     title: { type: String, required: true, unique: true },
//     description: { type: String, required: true },
//     code: { type: String, required: true, unique: true },
//     price: { type: Number, required: true },
//     status: { type: Boolean, default: true },
//     stock: { type: Number, required: true },
//     category: { type: String, required: true },
//     photoUrl: { type: String, default: "static/imgs/fotoGenerica.png" },
//   },
//   {
//     versionKey: false,
//     strict: "throw",
//   }
// );

// // Define el modelo de productos y se exporta
// export const ProductModel = model("Product", productSchema);

// // Clase Products actualizada para usar Mongoose
// export class Products {
//   async con(productData) {
//     // Devolver un nuevo objeto de producto con las propiedades proporcionadas
//     return productData;
//   }

//   async getProducts() {
//     try {
//       // Obtener todos los productos desde la base de datos MongoDB
//       const productList = await ProductModel.find();
//       return productList;
//     } catch (error) {
//       console.error("Error reading products from database:", error);
//       return [];
//     }
//   }

//   toPOJO(productList) {
//     // Devolver la lista de productos tal como está, ya que Mongoose devuelve objetos de MongoDB
//     return productList;
//   }
// }
