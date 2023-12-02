import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const { Schema, model } = mongoose;

// Define el esquema de los productos
const productSchema = new Schema(
  {
    _id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    code: { type: String, required: true },
    price: { type: Number, required: true },
    status: { type: Boolean, default: true },
    stock: { type: Number, required: true },
    category: { type: String, required: true },
    thumbnail: { type: String, required: false },
  },
  {
    versionKey: false,
  }
);

// Define el modelo de productos
const ProductModel = model("Product", productSchema);

// Exporta el esquema y el modelo
export { productSchema, ProductModel };

// Clase Products actualizada para usar Mongoose
export class Products {
  async con(productData) {
    // Devolver un nuevo objeto de producto con las propiedades proporcionadas
    return productData;
  }

  async getProducts() {
    try {
      // Obtener todos los productos desde la base de datos MongoDB
      const productList = await ProductModel.find();
      return productList;
    } catch (error) {
      console.error("Error reading products from database:", error);
      return [];
    }
  }

  toPOJO(productList) {
    // Devolver la lista de productos tal como está, ya que Mongoose devuelve objetos de MongoDB
    return productList;
  }
}
