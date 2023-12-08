import { Router } from "express";
import { CartModel } from "../models/CartsMongoose.js";

export const apiCartsRouter = Router();

//Mostrar todos los carritos
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

// Obtener un carrito por su ID ("/:cid")
apiCartsRouter.get("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;

    const populatedCart = await CartModel.findById(cid)
      .populate({
        path: "cartItems.productId",
        model: "products",
      })
      .lean();

    // Verificar si el carrito existe
    if (!populatedCart) {
      return res.status(404).json({ message: "Carrito no encontrado" });
    }

    res.json(populatedCart);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener el carrito",
      error: error.message,
    });
  }
});

// Ruta para crear un nuevo carrito vacío ("/create-cart")
apiCartsRouter.post("/", async (req, res) => {
  try {
    const createdCart = await CartModel.create(req.body);
    res.status(201).json(createdCart);
  } catch (error) {
    res.status(400).json({
      message: "Error al crear un nuevo carrito",
      error: error.message,
    });
  }
});

// Cargar producto a un carrito por ID con Id del producto y cantidad
apiCartsRouter.put("/:cid/cartItems/:productId", async (req, res) => {
  try {
    const { cid, productId } = req.params;
    const quantity = req.body.quantity || 1;

    const existingCartItem = await CartModel.findOne({
      _id: cid,
      "cartItems.productId": productId,
    });

    if (existingCartItem) {
      // Si ya existe el producto en el carrito, actualiza la cantidad
      const updatedCart = await CartModel.findOneAndUpdate(
        { _id: cid, "cartItems.productId": productId },
        {
          $inc: { "cartItems.$.quantity": quantity },
        },
        { new: true, useFindAndModify: false }
      );
      res.json(updatedCart);
    } else {
      // Si no existe, añade un nuevo elemento al carrito
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
    res.status(500).json({
      message: "Error al actualizar el carrito",
      error: error.message,
    });
  }
});

// Ruta para eliminar todos los productos del carrito ("/api/carts/:cid")
apiCartsRouter.delete("/:cid", async (req, res) => {
  try {
    // Intenta encontrar y eliminar el carrito por su ID
    const deletedCart = await CartModel.findByIdAndDelete(req.params.cid);

    // Si el carrito no se encuentra, responde con un código de estado 404 y un mensaje
    if (!deletedCart) {
      return res.status(404).json({ message: "Carrito no encontrado" });
    }

    // Si la eliminación es exitosa, responde con el carrito eliminado en formato JSON
    res.json(deletedCart);
  } catch (error) {
    // Si hay un error durante la operación, responde con un código de estado 500 y un mensaje de error
    console.error(error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

//Eliminar un producto del carrito por ID:

apiCartsRouter.delete("/:cid/cartItems/:productId", async (req, res) => {
  try {
    const { cid, productId } = req.params;

    const cartItem = await CartModel.findOneAndUpdate(
      { _id: cid, "cartItems.productId": productId },
      {
        $inc: { "cartItems.$.quantity": -1 }, // Resta 1 a la cantidad
      },
      { new: true, useFindAndModify: false }
    );

    // Si la cantidad llega a 0, elimina el elemento del carrito
    if (cartItem.cartItems[0].quantity === 0) {
      const updatedCart = await CartModel.findByIdAndUpdate(
        cid,
        {
          $pull: {
            cartItems: { productId },
          },
        },
        { new: true, useFindAndModify: false }
      );
      res.json(updatedCart);
    } else {
      res.json(cartItem);
    }
  } catch (error) {
    res.status(500).json({
      message: "Error al eliminar el producto del carrito",
      error: error.message,
    });
  }
});
