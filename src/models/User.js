import { Schema, model } from "mongoose";
import { randomUUID } from "crypto";
import { comparePassword, hashearPassword } from "../utils/crypto.js";
import { isAdmin } from "../middlewares/auth.js";
import { CartModel } from "./CartsMongoose.js";

const collection = "users";

const userSchema = new Schema(
  {
    _id: { type: String, default: randomUUID(), required: true, unique: true },
    email: { type: String, require: true, unique: true },
    password: { type: String, require: true },
    firstName: { type: String, require: true },
    lastName: { type: String, require: true },
    age: { type: Number, require: true },
    rol: { type: String, default: "user" },
    cart: { type: String, ref: "carts", unique: true },
  },
  {
    strict: "throw",
    versionKey: false,
    methods: {
      infoPublica: function () {
        return {
          email: this.email,
          firstName: this.firstName,
          lastName: this.lastName,
        };
      },
    },
    statics: {
      register: async function (reqBody) {
        reqBody.password = await hashearPassword(reqBody.password);
        const registeredUser = await model(collection).create(reqBody);

        // Crear un carrito asociado al usuario
        const createdCart = await CartModel.create({
          user: registeredUser._id,
        });

        // Asociar el ID del carrito al usuario
        registeredUser.cart = createdCart._id;
        await registeredUser.save();

        const registeredUserData = {
          email: registeredUser.email,
          firstName: registeredUser.firstName,
          lastName: registeredUser.lastName,
          age: registeredUser.age,
          rol: "user",
        };
        return registeredUserData;
      },
      auth: async function (username, password) {
        let registeredUserData;

        if (isAdmin(username, password)) {
          registeredUserData = {
            email: "admin",
            firstName: "admin",
            lastName: "admin",
            age: "admin",
            rol: "admin",
          };
        } else {
          const registeredUser = await model(collection)
            .findOne({ email: username })
            .lean();

          if (!registeredUser) {
            throw new Error("Usuario o contraseña inválido");
          }

          if (!comparePassword(password, registeredUser["password"])) {
            throw new Error("Usuario o contraseña inválido");
          }

          registeredUserData = {
            email: registeredUser["email"],
            firstName: registeredUser["firstName"],
            lastName: registeredUser["lastName"],
            age: registeredUser["age"],
            rol: "user",
          };
        }
        if (!registeredUserData) {
          throw new Error("Usuario o contraseña inválido");
        }
        return registeredUserData;
      },
      resetPassword: async function (email, password) {
        const newPassword = hashearPassword(password);

        const updatedUserPassword = await model(collection)
          .findOneAndUpdate(
            { email },
            { $set: { password: newPassword } },
            { new: true }
          )
          .lean();

        if (!updatedUserPassword) {
          throw new Error("usuario no encontrado");
        }
        return {
          email: updatedUserPassword["email"],
          firstName: updatedUserPassword["firstName"],
          lastName: updatedUserPassword["lastName"],
          age: updatedUserPassword["age"],
          rol: "user",
        };
      },
    },
  }
);

// Define el modelo de cartos y se exporta
export const UserModel = model(collection, userSchema);
