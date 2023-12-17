import { Schema, model } from "mongoose";
import { randomUUID } from "crypto";

const collection = "users";

const userSchema = new Schema(
  {
    _id: { type: String, default: randomUUID(), required: true, unique: true },
    email: { type: String, require: true },
    password: { type: String, require: true },
    firstName: { type: String, require: true },
    lastName: { type: String, require: true },
  },
  {
    strict: "throw",
    versionKey: false,
  }
);

// Define el modelo de cartos y se exporta
export const UserModel = model(collection, userSchema);
