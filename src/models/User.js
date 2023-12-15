import { Schema, model } from "mongoose";
import { randomUUID } from "crypto";

const collection = "users";

const userSchema = new Schema(
  {
    _id: { type: String, default: randomUUID(), required: true, unique: true },
    email: { type: String, default: true },
    password: { type: String, default: true },
    firstName: { type: String, default: true },
    lastName: { type: String, default: true },
  },
  {
    strict: "throw",
    versionKey: false,
  }
);

// Define el modelo de cartos y se exporta
export const UserModel = model(collection, userSchema);
