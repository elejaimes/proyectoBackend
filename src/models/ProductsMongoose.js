import { Schema, model } from "mongoose";
import { randomUUID } from "crypto";
import mongoosePaginate from "mongoose-paginate-v2";

const collection = "products";

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

productSchema.plugin(mongoosePaginate);

// Define el modelo de productos y se exporta
export const ProductModel = model(collection, productSchema);
