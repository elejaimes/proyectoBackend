import { CartService } from "../../services/carts.service.js";

export async function getAllCarts(req, res) {
  try {
    const populatedCarts = await CartService.showCarts();
    res.render("allCarts.handlebars", { carts: populatedCarts });
  } catch (error) {
    console.error(error);
    res.status(500).render("error", {
      error: "Error al obtener los carritos",
      details: error.message,
    });
  }
}
export async function getCartById(req, res) {
  try {
    const cartId = req.params.cartId;

    const populatedCart = await CartService.showCartById(
      cartId,
      req.user._id,
      req.user.rol
    );

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
}

export async function getUserCart(req, res) {
  try {
    const userId = req.user._id;
    const userCart = await CartService.showUserCart(userId);

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
}

export async function updateCart(req, res) {
  try {
    const userId = req.user._id;
    const productId = req.params.productId;
    const quantity = parseInt(req.body.quantity, 10) || 1;

    const updatedCart = await CartService.updateCartItem(
      userId,
      productId,
      quantity
    );

    if (!updatedCart) {
      return res.status(404).render("error.handlebars");
    }
    res.redirect("/user-cart");
  } catch (error) {
    console.error(error);
    res.status(500).render("error", {
      error: "Error al agregar el producto al carrito",
      details: error.message,
    });
  }
}

export async function clearCart(req, res) {
  try {
    const cartId = req.params.cartId;

    const updatedCart = await CartService.deleteAllProducts(cartId);

    if (!updatedCart) {
      return res.status(404).render("error.handlebars");
    }
    res.redirect("/products");
  } catch (error) {
    console.error(error);
    res.status(500).render("error", {
      error: "Error al vaciar el carrito",
      details: error.message,
    });
  }
}

export async function deleteProductFromCart(req, res) {
  try {
    const cartId = req.params.cartId;
    const productId = req.params.productId;

    const updatedCart = await CartService.deleteProduct(cartId, productId);

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
