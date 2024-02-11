import { hashearPassword, comparePassword } from "../utils/crypto.js";
import { UserDao } from "../daos/users.dao.js";
import { CartDao } from "../daos/carts.dao.js"; // Asegúrate de tener la ruta correcta

export class UserService {
  async registerUser(userData) {
    try {
      userData.password = await hashearPassword(userData.password);
      const registeredUser = await UserDao.createUser(userData);

      // Crear un carrito asociado al usuario utilizando la capa de persistencia
      const userCart = await CartDao.createCart(registeredUser._id);

      const registeredUserData = {
        email: registeredUser.email,
        firstName: registeredUser.firstName,
        lastName: registeredUser.lastName,
        age: registeredUser.age,
        rol: "user",
        cart: userCart._id, // Asocia el ID del carrito al usuario en la respuesta
      };

      return registeredUserData;
    } catch (error) {
      throw new Error(`Error en UserService.registerUser: ${error.message}`);
    }
  }

  async authenticateUser(username, password) {
    try {
      let registeredUserData;

      if (isAdmin(username, password)) {
        registeredUserData = {
          email: "admin",
          firstName: "admin",
          lastName: "admin",
          age: "admin",
          rol: "admin",
        };
      } else {
        const registeredUser = await UserDao.getUserByEmail(username);

        if (
          !registeredUser ||
          !comparePassword(password, registeredUser.password)
        ) {
          throw new Error("Usuario o contraseña inválido");
        }

        registeredUserData = {
          email: registeredUser.email,
          firstName: registeredUser.firstName,
          lastName: registeredUser.lastName,
          age: registeredUser.age,
          rol: "user",
        };
      }

      if (!registeredUserData) {
        throw new Error("Usuario o contraseña inválido");
      }

      return registeredUserData;
    } catch (error) {
      throw new Error(
        `Error en UserService.authenticateUser: ${error.message}`
      );
    }
  }

  async resetUserPassword(email, password) {
    try {
      const newPassword = await hashearPassword(password);

      const updatedUserPassword = await UserDao.updateUserPassword(
        email,
        newPassword
      );

      if (!updatedUserPassword) {
        throw new Error("Usuario no encontrado");
      }

      const updatedUserData = {
        email: updatedUserPassword.email,
        firstName: updatedUserPassword.firstName,
        lastName: updatedUserPassword.lastName,
        age: updatedUserPassword.age,
        rol: "user",
      };

      return updatedUserData;
    } catch (error) {
      throw new Error(
        `Error en UserService.resetUserPassword: ${error.message}`
      );
    }
  }

  async getLoggedUser(email) {
    try {
      const user = await UserDao.getUserByEmail(email);
      return user;
    } catch (error) {
      throw new Error(`Error en UserService.getLoggedUser: ${error.message}`);
    }
  }

  async getAllUsers() {
    try {
      return await UserDao.getAllUsers();
    } catch (error) {
      throw new Error(`Error en UserService.getAllUsers: ${error.message}`);
    }
  }
}
