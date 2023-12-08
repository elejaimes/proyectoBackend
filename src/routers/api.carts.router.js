import { Router } from "express";
import { CartModel } from "../models/CartsMongoose.js";
import mongoose from "mongoose";

export const apiCartsRouter = Router();

// Mostrar todos los carritos ("/api/carts")
apiCartsRouter.get("/", async (req, res) => {
  try {
    const populatedCarts = await CartModel.find()
      .populate({
        path: "cartItems.productId",
        model: "products",
      })
      .lean();

    res.json(populatedCarts);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener los carritos",
      error: error.message,
    });
  }
});

// Obtener un carrito por su ID ("/api/carts/:cid")
apiCartsRouter.get("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;

    const populatedCart = await CartModel.findById(cid)
      .populate({
        path: "cartItems.productId",
        model: "products",
      })
      .lean();

    if (!populatedCart) {
      return res.status(404).json({ message: "Carrito no encontrado" });
    }

    res.json(populatedCart);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error al obtener el carrito",
      error: error.message,
    });
  }
});

// Ruta para crear un nuevo carrito vacío ("/api/carts/create-cart")
apiCartsRouter.post("/", async (req, res) => {
  try {
    const createdCart = await CartModel.create(req.body);
    res.status(201).json(createdCart);
  } catch (error) {
    console.error(error);
    res.status(400).json({
      message: "Error al crear un nuevo carrito",
      error: error.message,
    });
  }
});

// Ruta para obtener todas las categorías de productos en los carritos ("/api/carts/categories")
apiCartsRouter.get("/categories", async (req, res) => {
  try {
    const categories = await CartModel.distinct("cartItems.productId.category");
    res.json(categories);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener las categorías de productos en los carritos",
      error: error.message,
    });
  }
});

// Cargar producto a un carrito por ID con Id del producto y cantidad ("/api/carts/:cid/cartItems/:productId")
apiCartsRouter.put("/:cid/cartItems/:productId", async (req, res) => {
  try {
    const { cid, productId } = req.params;
    const quantity = req.body.quantity || 1;

    const existingCartItem = await CartModel.findOne({
      _id: cid,
      "cartItems.productId": productId,
    });

    if (existingCartItem) {
      const updatedCart = await CartModel.findOneAndUpdate(
        { _id: cid, "cartItems.productId": productId },
        { $inc: { "cartItems.$.quantity": quantity } },
        { new: true, useFindAndModify: false }
      );
      res.json(updatedCart);
    } else {
      const updatedCart = await CartModel.findByIdAndUpdate(
        cid,
        {
          $push: {
            cartItems: { productId, quantity },
          },
        },
        { new: true, useFindAndModify: false }
      );
      res.json(updatedCart);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error al actualizar el carrito",
      error: error.message,
    });
  }
});

// Ruta para eliminar todos los productos del carrito ("/api/carts/:cid")
apiCartsRouter.delete("/:cid", async (req, res) => {
  try {
    const deletedCart = await CartModel.findByIdAndDelete(req.params.cid);

    if (!deletedCart) {
      return res.status(404).json({ message: "Carrito no encontrado" });
    }

    res.json(deletedCart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

// Eliminar un producto del carrito por ID ("/api/carts/:cid/cartItems/:productId")
apiCartsRouter.delete("/:cid/cartItems/:productId", async (req, res) => {
  try {
    const { cid, productId } = req.params;

    const cartItem = await CartModel.findOneAndUpdate(
      { _id: cid, "cartItems.productId": productId },
      { $inc: { "cartItems.$.quantity": -1 } },
      { new: true, useFindAndModify: false }
    );

    if (cartItem.cartItems[0].quantity === 0) {
      const updatedCart = await CartModel.findByIdAndUpdate(
        cid,
        { $pull: { cartItems: { productId } } },
        { new: true, useFindAndModify: false }
      );
      res.json(updatedCart);
    } else {
      res.json(cartItem);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error al eliminar el producto del carrito",
      error: error.message,
    });
  }
});

// Ruta para obtener todos los productos en el carrito ("/:cid/allProducts")
apiCartsRouter.get("/:cid/allProducts", async (req, res) => {
  try {
    const { cid } = req.params;

    const cartProducts = await CartModel.aggregate([
      { $match: { _id: mongoose.Types.ObjectId(cid) } },
      { $unwind: "$cartItems" },
      {
        $lookup: {
          from: "products",
          localField: "cartItems.productId",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      { $unwind: "$productDetails" },
      {
        $group: {
          _id: "$_id",
          cartItems: { $push: "$cartItems" },
          totalPrice: {
            $sum: {
              $multiply: ["$cartItems.quantity", "$productDetails.price"],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          cartItems: 1,
          totalPrice: 1,
        },
      },
    ]);

    res.json(cartProducts[0]);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener los productos en el carrito",
      error: error.message,
    });
  }
});
