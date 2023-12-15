import { Schema, model } from "mongoose";
import { randomUUID } from "crypto";

const collection = "carts";

// Define el esquema de los carritos

const cartItemSchema = new Schema({
  productId: { type: String, ref: "products" },
  quantity: { type: Number, default: 0 },
});

const cartSchema = new Schema(
  {
    _id: { type: String, default: randomUUID(), required: true, unique: true },
    status: { type: Boolean, default: true },
    cartItems: [cartItemSchema],
  },
  {
    strict: "throw",
    versionKey: false,
  }
);

// Define el modelo de cartos y se exporta
export const CartModel = model(collection, cartSchema);
