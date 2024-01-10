import { Router } from "express";
import { CartModel } from "../../models/CartsMongoose.js";
import { loggedAdmin, loggedUserWeb } from "../../middlewares/auth.js";
import { UserModel } from "../../models/User.js";

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

// // Crear un carrito o redirigir a carrito ya existente
// webCartsRouter.post("/carts/create", loggedUserWeb, async (req, res) => {
//   try {
//     const userId = req.user._id;

//     // Verifica si el usuario ya tiene un carrito
//     const existingCart = await CartModel.findOne({ user: userId });

//     if (existingCart) {
//       // Si el usuario ya tiene un carrito, redirige a la página de visualización del carrito
//       return res.redirect(`/carts/${existingCart._id}`);
//     }

//     // Crea un nuevo carrito para el usuario
//     const newCart = await CartModel.create({ user: userId, cartItems: [] });

//     // Redirige a la página de visualización del carrito recién creado
//     res.redirect(`/carts/${newCart._id}`);
//   } catch (error) {
//     console.error(error);
//     res.status(500).render("error", {
//       error: "Error al crear un nuevo carrito",
//       details: error.message,
//     });
//   }
// });

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
    res.json(userCart);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error al obtener el carrito",
      error: error.message,
    });
  }
});

// Ruta para actualizar un carrito
webCartsRouter.put(
  "/carts/:cartId/:productId",
  loggedUserWeb,
  async (req, res) => {
    try {
      const userId = req.user._id;
      const cartId = req.params.cartId;
      const productId = req.params.productId;
      const quantity = parseInt(req.body.quantity, 10);

      if (!quantity || isNaN(quantity) || quantity <= 0) {
        return res
          .status(400)
          .json({ message: "La cantidad debe ser un número positivo" });
      }

      const existingCartItem = await CartModel.findOne({
        user: userId,
        _id: cartId,
        "cartItems.productId": productId,
      });

      if (existingCartItem) {
        const updatedCart = await CartModel.findOneAndUpdate(
          { user: userId, _id: cartId, "cartItems.productId": productId },
          { $inc: { "cartItems.$.quantity": quantity } },
          { new: true, useFindAndModify: false }
        );
        res.json(updatedCart);
      } else {
        const updatedCart = await CartModel.findOneAndUpdate(
          { user: userId, _id: cartId },
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
  }
);

// Ruta para eliminar el carrito del usuario
webCartsRouter.delete("/carts/:cartId", loggedUserWeb, async (req, res) => {
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
  "/carts/:cartId/:productId",
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
