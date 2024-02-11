import { UserModel } from '../models/UserMongoose.js'

export class UserDao {
    async createUser(userData) {
        return await UserModel.create(userData)
    }

    async getUserByEmail(email) {
        return await UserModel.findOne({ email }).lean()
    }

    async getAllUsers() {
        return await UserModel.find({}, { password: 0 }).lean()
    }

    async updateUserPassword(email, newPassword) {
        return await UserModel.findOneAndUpdate(
            { email },
            { $set: { password: newPassword } },
            { new: true }
        ).lean()
    }

    async updateUserCart(userId, cartId) {
        try {
            // Actualizamos el campo 'cart' del usuario con el ID del carrito
            return await UserModel.findByIdAndUpdate(userId, {
                $set: { cart: cartId },
            })
        } catch (error) {
            throw new Error(
                `Error al actualizar el carrito del usuario: ${error.message}`
            )
        }
    }
}
