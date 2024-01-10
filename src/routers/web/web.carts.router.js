import { Router } from "express";
import { CartModel } from "../../models/CartsMongoose.js";
import { loggedAdmin, loggedUserWeb } from "../../middlewares/auth.js";

export const webCartsRouter = Router();

// Ruta para obtener y mostrar todos los carritos (solo para el administrador)
webCartsRouter.get("/allCarts", loggedAdmin, async (req, res) => {
  try {
    const populatedCarts = await CartModel.find()
      .populate({
        path: "cartItems.productId",
        model: "products",
      })
      .lean();

    res.render("allCarts.handlebars", { carts: populatedCarts });
  } catch (error) {
    console.error(error);
    res.status(500).render("error", {
      error: "Error al obtener los carritos",
      details: error.message,
    });
  }
});

// Ruta para ver un carrito por ID (solo para el administrador)
webCartsRouter.get("/allCarts/:cartId", loggedAdmin, async (req, res) => {
  try {
    const cartId = req.params.cartId;

    const populatedCart = await CartModel.findById(cartId)
      .populate({
        path: "cartItems.productId",
        model: "products",
      })
      .lean();

    if (!populatedCart) {
      return res.status(404).render("error.handlebars");
    }

    res.render("carts.handlebars", { cart: populatedCart });
  } catch (error) {
    console.error(error);
    res.status(500).render("error", {
      error: "Error al obtener el carrito",
      details: error.message,
    });
  }
});

// Obtener el carrito del usuario autenticado
webCartsRouter.get("/user-cart", loggedUserWeb, async (req, res) => {
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
    res.render("carts.handlebars", { cart: userCart });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error al obtener el carrito",
      error: error.message,
    });
  }
});

// Ruta para actualizar un carrito
webCartsRouter.post(
  "/user-cart/:productId",
  loggedUserWeb,
  async (req, res) => {
    try {
      const userId = req.user._id;
      const productId = req.params.productId;
      const quantity = parseInt(req.body.quantity, 10) || 1;

      if (!quantity || isNaN(quantity) || quantity <= 0) {
        // Puedes manejar el error de validación aquí
        return res.redirect("/products"); // Redirige a la página de productos
      }

      // Buscar el carrito del usuario
      let userCart = await CartModel.findOne({ user: userId });

      // Si el usuario no tiene un carrito, créalo
      if (!userCart) {
        userCart = await CartModel.create({ user: userId });
      }

      // Buscar si el producto ya está en el carrito
      const existingCartItem = userCart.cartItems.find(
        (item) => item.productId === productId
      );

      if (existingCartItem) {
        // Si el producto ya está en el carrito, actualiza la cantidad
        existingCartItem.quantity += quantity;
      } else {
        // Si el producto no está en el carrito, agrégalo
        userCart.cartItems.push({ productId, quantity });
      }

      // Guardar el carrito actualizado en la base de datos
      await userCart.save();

      // Redirige al usuario a la página del carrito después de actualizarlo
      res.redirect("/user-cart");
    } catch (error) {
      console.error(error);
      res.status(500).render("error", {
        error: "Error al agregar el producto al carrito",
        details: error.message,
      });
    }
  }
);

// Ruta para eliminar el carrito del usuario
webCartsRouter.delete("/user-cart/:cartId", loggedUserWeb, async (req, res) => {
  try {
    const userId = req.user._id;
    const cartId = req.params.cartId;

    const deletedCart = await CartModel.findOneAndDelete({
      user: userId,
      _id: cartId,
    });

    if (!deletedCart) {
      return res.status(404).render("error.handlebars");
    }

    // Después de eliminar el carrito, redirige al usuario a la página de productos
    res.redirect("/products");
  } catch (error) {
    console.error(error);
    res.status(500).render("error", {
      error: "Error al eliminar el carrito",
      details: error.message,
    });
  }
});

// Ruta para eliminar un producto del carrito del usuario
webCartsRouter.delete(
  "/user-cart/:cartId/:productId",
  loggedUserWeb,
  async (req, res) => {
    try {
      const userId = req.user._id;
      const cartId = req.params.cartId;
      const productId = req.params.productId;

      const updatedCart = await CartModel.findOneAndUpdate(
        { user: userId, _id: cartId, "cartItems.productId": productId },
        {
          $inc: { "cartItems.$.quantity": -1 },
          $pull: { cartItems: { productId, quantity: { $lte: 0 } } },
        },
        { new: true, useFindAndModify: false }
      );

      if (!updatedCart) {
        return res.status(404).render("error.handlebars");
      }

      res.redirect("/carts");
    } catch (error) {
      console.error(error);
      res.status(500).render("error", {
        error: "Error al eliminar el producto del carrito",
        details: error.message,
      });
    }
  }
);
