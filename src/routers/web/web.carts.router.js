import { Router } from "express";
import { CartModel } from "../../models/CartsMongoose.js";

export const webCartsRouter = Router();

// Ruta para obtener y mostrar todos los carritos
webCartsRouter.get("/carts", async (req, res) => {
  try {
    const populatedCarts = await CartModel.find()
      .populate({
        path: "cartItems.productId",
        model: "products",
      })
      .lean();

    res.render("cartPage", { carts: populatedCarts });
  } catch (error) {
    console.error(error);
    res.status(500).render("error", {
      error: "Error al obtener los carritos",
      details: error.message,
    });
  }
});

// Ruta para crear un nuevo carrito
webCartsRouter.post("/carts", async (req, res) => {
  try {
    const createdCart = await CartModel.create(req.body);
    // Redirige al usuario al carrito recién creado
    res.redirect(`/carts/${createdCart._id}`);
  } catch (error) {
    console.error(error);
    res.status(400).render("error", {
      error: "Error al crear un nuevo carrito",
      details: error.message,
    });
  }
});

// Ruta para obtener y mostrar un carrito específico
webCartsRouter.get("/carts/:cid", async (req, res) => {
  try {
    const { cid } = req.params;

    const populatedCart = await CartModel.findById(cid)
      .populate({
        path: "cartItems.productId",
        model: "products",
      })
      .lean();

    if (!populatedCart) {
      return res.status(404).render("cartNotFound", { cartId: cid });
    }

    res.render("singleCartPage", { cart: populatedCart });
  } catch (error) {
    console.error(error);
    res.status(500).render("error", {
      error: "Error al obtener el carrito",
      details: error.message,
    });
  }
});

// Ruta para actualizar un carrito
webCartsRouter.put("/carts/:cid/:productId", async (req, res) => {
  try {
    const { cid, productId } = req.params;
    const quantity = parseInt(req.body.quantity, 10);

    if (isNaN(quantity) || quantity <= 0) {
      return res
        .status(400)
        .json({ message: "La cantidad debe ser un número positivo" });
    }

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

// Ruta para eliminar un carrito
webCartsRouter.delete("/carts/:cid", async (req, res) => {
  try {
    const deletedCart = await CartModel.findByIdAndDelete(req.params.cid);

    if (!deletedCart) {
      return res.status(404).render("cartNotFound", { cartId: req.params.cid });
    }

    // Después de eliminar el carrito, puedes redirigir al usuario a la página de carritos, por ejemplo
    res.redirect("/carts");
  } catch (error) {
    console.error(error);
    res.status(500).render("error", {
      error: "Error al eliminar el carrito",
      details: error.message,
    });
  }
});

// Ruta para eliminar un producto del carrito
webCartsRouter.delete("/carts/:cid/:productId", async (req, res) => {
  try {
    const { cid, productId } = req.params;

    const updatedCart = await CartModel.findByIdAndUpdate(
      cid,
      {
        $inc: { "cartItems.$.quantity": -1 },
        $pull: { cartItems: { productId, quantity: { $lte: 0 } } },
      },
      { new: true, useFindAndModify: false }
    );

    if (!updatedCart) {
      return res.status(404).render("cartNotFound", { cartId: cid });
    }

    res.redirect(`/carts/${cid}`);
  } catch (error) {
    console.error(error);
    res.status(500).render("error", {
      error: "Error al eliminar el producto del carrito",
      details: error.message,
    });
  }
});
