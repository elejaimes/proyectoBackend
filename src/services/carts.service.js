import { CartDao } from "../daos/carts.dao.js";
import { UserDao } from "../daos/users.dao.js";

export class CartService {
  async createCartForUser(userData) {
    try {
      const user = await UserDao.getUserByEmail(userData.email);

      if (!user) {
        throw new Error("Usuario no encontrado");
      }

      const createdCart = await CartDao.createCart(user._id);
      await Cart.associateCartWithUser(user._id, createdCart._id);

      return { user, createdCart };
    } catch (error) {
      throw new Error(`Error al crear carrito para usuario: ${error.message}`);
    }
  }

  async showCarts() {
    try {
      return await CartDao.showCarts();
    } catch (error) {
      throw new Error(`Error al obtener los carritos: ${error.message}`);
    }
  }

  async showUserCart(userId) {
    try {
      return await CartDao.showUserCart(userId);
    } catch (error) {
      throw new Error(
        `Error al obtener el carrito del usuario: ${error.message}`
      );
    }
  }

  async showCartById(cartId, userId, userRole) {
    try {
      const cart = await CartDao.showCartById(cartId, userId, userRole);
      return cart;
    } catch (error) {
      throw new Error(`Error al obtener el carrito: ${error.message}`);
    }
  }

  async addProduct(cartId, productId, quantity) {
    try {
      return await CartDao.addProduct(cartId, productId, quantity);
    } catch (error) {
      throw new Error(`Error al actualizar el carrito: ${error.message}`);
    }
  }

  async deleteAllProducts(cartId) {
    try {
      return await CartDao.deleteAllProducts(cartId);
    } catch (error) {
      throw new Error(
        `Error al eliminar todos los productos: ${error.message}`
      );
    }
  }

  async deleteProduct(cartId, productId) {
    try {
      return await CartDao.deleteProduct(cartId, productId);
    } catch (error) {
      throw new Error(
        `Error al eliminar el producto del carrito: ${error.message}`
      );
    }
  }

  async updateCartItem(userId, productId, quantity) {
    try {
      return await CartDao.updateCartItem(userId, productId, quantity);
    } catch (error) {
      throw new Error(`Error al actualizar el carrito: ${error.message}`);
    }
  }

  async deleteAllCarts() {
    try {
      return await CartDao.deleteAllCarts();
    } catch (error) {
      throw new Error(`Error al eliminar todos los carritos: ${error.message}`);
    }
  }
}
