import { CartModel } from "../models/CartsMongoose.js";

export async function showCarts(req, res, next) {
  try {
    const populatedCarts = await CartModel.showCarts();
    res.json(populatedCarts);
  } catch (error) {
    next(error); // Llama a la siguiente función de manejo de errores en Express
  }
}

export async function showUserCart(req, res, next) {
  try {
    const userId = req.user._id;
    const userCart = await CartModel.showUserCart(userId);
    res.json(userCart);
  } catch (error) {
    next(error);
  }
}

export async function createCart(req, res, next) {
  try {
    const userId = req.user._id;
    const createdCart = await CartModel.createCart(userId);
    res.json(createdCart);
  } catch (error) {
    next(error);
  }
}
export async function addProductToCart(req, res, next) {
  try {
    const { cid, productId } = req.params;
    const quantity = req.body.quantity || 1;
    const updatedCart = await CartModel.addProduct(cid, productId, quantity);
    res.json(updatedCart);
  } catch (error) {
    next(error);
  }
}
export async function deleteAllProducts(req, res, next) {
  try {
    const { cid } = req.params;
    const updatedCart = await CartModel.deleteAllProducts(cid);
    res.json(updatedCart);
  } catch (error) {
    next(error);
  }
}
export async function deleteProductFromCart(req, res, next) {
  try {
    const { cid, productId } = req.params;
    const updatedCart = await CartModel.deleteProduct(cid, productId);
    res.json(updatedCart);
  } catch (error) {
    next(error);
  }
}
export async function showCartById(req, res, next) {
  try {
    const { cid } = req.params;
    const userId = req.user._id;
    const userRole = req.user.rol;

    const cart = await CartModel.showCartById(cid, userId, userRole);
    res.json(cart);
  } catch (error) {
    next(error);
  }
}
