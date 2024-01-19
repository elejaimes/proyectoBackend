import { Router } from "express";
import { loggedAdmin, loggedUserApi } from "../../middlewares/auth.js";
import {
  addProductToCart,
  createCart,
  deleteAllProducts,
  deleteProductFromCart,
  showCartById,
  showCarts,
  showUserCart,
} from "../../controllers/api/carts.controllers.js";

export const apiCartsRouter = Router();

// Mostrar todos los carritos como admin
apiCartsRouter.get("/", loggedAdmin, showCarts);

// Obtener el carrito del usuario autenticado ("/api/carts")
apiCartsRouter.get("/user-cart", loggedUserApi, showUserCart);

// Ruta para crear un nuevo carrito vacío ("/api/carts/create-cart")
apiCartsRouter.post("/", loggedUserApi, createCart);

// Cargar producto a un carrito por ID con Id del producto y cantidad ("/api/carts/:cid/:productId")
apiCartsRouter.put("/:cid/:productId", loggedUserApi, addProductToCart);

// Ruta para eliminar todos los productos del carrito ("/api/carts/:cid")
apiCartsRouter.delete("/:cid", loggedUserApi, deleteAllProducts);

// Eliminar un producto del carrito por ID ("/api/carts/:cid/:productId")
apiCartsRouter.delete("/:cid/:productId", loggedUserApi, deleteProductFromCart);

// Obtener un carrito por su ID ("/api/carts/:cid")
apiCartsRouter.get("/:cid", loggedAdmin, showCartById);
