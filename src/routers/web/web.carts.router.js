import { Router } from "express";
import { loggedAdmin, loggedUserWeb } from "../../middlewares/auth.js";
import {
  clearCart,
  deleteProductFromCart,
  getAllCarts,
  getCartById,
  getUserCart,
  updateCart,
} from "../../controllers/web/carts.controllers.js";

export const webCartsRouter = Router();

// Ruta para obtener y mostrar todos los carritos (solo para el administrador)
webCartsRouter.get("/allCarts", loggedAdmin, getAllCarts);

// Ruta para ver un carrito por ID (solo para el administrador)
webCartsRouter.get("/allCarts/:cartId", loggedAdmin, getCartById);

// Obtener el carrito del usuario autenticado
webCartsRouter.get("/user-cart", loggedUserWeb, getUserCart);

// Ruta para actualizar un carrito
webCartsRouter.post("/user-cart/:productId", loggedUserWeb, updateCart);

// Ruta para eliminar el carrito del usuario
webCartsRouter.delete("/user-cart/:cartId/clear", loggedUserWeb, clearCart);

// Ruta para eliminar un producto del carrito del usuario
webCartsRouter.delete(
  "/user-cart/:cartId/:productId",
  loggedUserWeb,
  deleteProductFromCart
);
