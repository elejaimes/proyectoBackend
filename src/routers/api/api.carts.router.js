import { Router } from "express";
import { CartModel } from "../../models/CartsMongoose.js";
import { loggedAdmin, loggedUserApi } from "../../middlewares/auth.js";

export const apiCartsRouter = Router();

// Mostrar todos los carritos ("/api/carts")
apiCartsRouter.get("/", loggedAdmin, async (req, res) => {
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

// Obtener el carrito del usuario autenticado ("/api/carts")
apiCartsRouter.get("/user-cart", loggedUserApi, async (req, res) => {
  try {
    const userId = req.user._id;
    const userCart = await CartModel.findOne({ user: userId })
      .populate({
        path: "cartItems.productId",
        model: "products",
      })
      .lean();

    if (!userCart) {
      return res.status(404).json({ message: "Carrito no encontrado" });
    }
    res.json(userCart);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error al obtener el carrito",
      error: error.message,
    });
  }
});

// Obtener un carrito por su ID ("/api/carts/:cid")
apiCartsRouter.get("/:cid", loggedUserApi, async (req, res) => {
  try {
    const { cid } = req.params;
    const userId = req.user._id;

    const cart = await CartModel.findById(cid)
      .populate({
        path: "cartItems.productId",
        model: "products",
      })
      .lean();

    if (!cart) {
      return res.status(404).json({ message: "Carrito no encontrado" });
    }

    if (cart.user !== userId) {
      return res.status(403).json({
        message: "No tienes permisos para ver este carrito",
      });
    }

    res.json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error al obtener el carrito",
      error: error.message,
    });
  }
});

// Ruta para crear un nuevo carrito vacío ("/api/carts/create-cart")
apiCartsRouter.post("/", loggedUserApi, async (req, res) => {
  try {
    // Crear un carrito asociado al usuario
    const createdCart = await CartModel.create({ user: req.user._id });

    // Asociar el ID del carrito al usuario
    req.user.cart = createdCart._id;
    await req.user.save();
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

// Cargar producto a un carrito por ID con Id del producto y cantidad ("/api/carts/:cid/:productId")
apiCartsRouter.put("/:cid/:productId", loggedUserApi, async (req, res) => {
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
apiCartsRouter.delete("/:cid", loggedUserApi, async (req, res) => {
  try {
    const { cid } = req.params;
    const userId = req.user._id;

    // Verificar si el carrito pertenece al usuario autenticado
    const cart = await CartModel.findOne({ _id: cid, user: userId });
    if (!cart) {
      return res.status(403).json({
        message: "No tienes permisos para eliminar este carrito",
      });
    }

    const deletedCart = await CartModel.findByIdAndDelete(cid);

    if (!deletedCart) {
      return res.status(404).json({ message: "Carrito no encontrado" });
    }

    res.json(deletedCart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

// Eliminar un producto del carrito por ID ("/api/carts/:cid/:productId")
apiCartsRouter.delete("/:cid/:productId", loggedUserApi, async (req, res) => {
  try {
    const { cid, productId } = req.params;
    const userId = req.user._id;

    // Verificar si el carrito pertenece al usuario autenticado
    const cart = await CartModel.findOne({ _id: cid, user: userId });
    if (!cart) {
      return res.status(403).json({
        message: "No tienes permisos para eliminar productos de este carrito",
      });
    }

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
