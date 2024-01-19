import { Schema, model } from "mongoose";
import { randomUUID } from "crypto";
import { UserModel } from "./User.js";

const collection = "carts";

const cartItemSchema = new Schema({
  productId: { type: String, ref: "products" },
  quantity: { type: Number, default: 0 },
});

const cartSchema = new Schema(
  {
    _id: {
      type: String,
      default: () => randomUUID(),
      required: true,
      unique: true,
    },
    status: { type: Boolean, default: true },
    cartItems: [cartItemSchema],
    user: { type: String, ref: "users" },
  },
  {
    strict: "throw",
    versionKey: false,
    methods: {},
    statics: {
      createCart: async function (userId) {
        try {
          const createdCart = await this.create({ user: userId });

          // Asociar el ID del carrito al usuario
          const user = await UserModel.findById(userId);
          if (user) {
            user.cart = createdCart._id;
            await user.save();
          }

          return createdCart;
        } catch (error) {
          throw new Error(`Error al crear un nuevo carrito: ${error.message}`);
        }
      },
      showCarts: async function () {
        try {
          const populatedCarts = await this.find()
            .populate({
              path: "cartItems.productId",
              model: "products",
            })
            .lean();

          return populatedCarts;
        } catch (error) {
          throw new Error(`Error al obtener los carritos: ${error.message}`);
        }
      },
      showUserCart: async function (userId) {
        try {
          const userCart = await this.findOne({ user: userId })
            .populate({
              path: "cartItems.productId",
              model: "products",
            })
            .lean();

          return userCart;
        } catch (error) {
          throw new Error(
            `Error al obtener el carrito del usuario: ${error.message}`
          );
        }
      },
      showCartById: async function (cartId, userId, userRole) {
        try {
          const cart = await this.findById(cartId)
            .populate({
              path: "cartItems.productId",
              model: "products",
            })
            .lean();

          // Verificación de permisos: Solo permitir el acceso a administradores
          if (userRole !== "admin") {
            throw new Error("No tienes permisos para ver este carrito");
          }

          return cart;
        } catch (error) {
          throw new Error(`Error al obtener el carrito: ${error.message}`);
        }
      },
      addProduct: async function (cartId, productId, quantity) {
        try {
          const existingCartItem = await this.findOne({
            _id: cartId,
            "cartItems.productId": productId,
          });

          if (existingCartItem) {
            const updatedCart = await this.findOneAndUpdate(
              { _id: cartId, "cartItems.productId": productId },
              { $inc: { "cartItems.$.quantity": quantity } },
              { new: true, useFindAndModify: false }
            );
            return updatedCart;
          } else {
            const updatedCart = await this.findByIdAndUpdate(
              cartId,
              {
                $push: {
                  cartItems: { productId, quantity },
                },
              },
              { new: true, useFindAndModify: false }
            );
            return updatedCart;
          }
        } catch (error) {
          throw new Error(`Error al actualizar el carrito: ${error.message}`);
        }
      },
      deleteAllProducts: async function (cartId) {
        try {
          const updatedCart = await this.findByIdAndUpdate(
            cartId,
            { $set: { cartItems: [] } },
            { new: true, useFindAndModify: false }
          );
          return updatedCart;
        } catch (error) {
          throw new Error(
            `Error al eliminar todos los productos: ${error.message}`
          );
        }
      },
      deleteProduct: async function (cartId, productId) {
        try {
          const updatedCart = await this.findOneAndUpdate(
            { _id: cartId, "cartItems.productId": productId },
            { $inc: { "cartItems.$.quantity": -1 } },
            { new: true, useFindAndModify: false }
          );

          if (updatedCart.cartItems[0].quantity === 0) {
            const finalCart = await this.findByIdAndUpdate(
              cartId,
              { $pull: { cartItems: { productId } } },
              { new: true, useFindAndModify: false }
            );
            return finalCart;
          } else {
            return updatedCart;
          }
        } catch (error) {
          throw new Error(
            `Error al eliminar el producto del carrito: ${error.message}`
          );
        }
      },
    },
  }
);

export const CartModel = model(collection, cartSchema);
