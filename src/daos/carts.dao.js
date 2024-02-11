import { CartModel } from '../models/CartsMongoose.js'

export class CartDao {
    async createCart(userId) {
        try {
            return await CartModel.create({ user: userId })
        } catch (error) {
            throw new Error(`Error al crear un nuevo carrito: ${error.message}`)
        }
    }

    async associateCartWithUser(userId, cartId) {
        try {
            await UserDao.updateUserCart(userId, cartId)
        } catch (error) {
            throw new Error(
                `Error al asociar carrito con usuario: ${error.message}`
            )
        }
    }

    async showCarts() {
        try {
            return await CartModel.find()
                .populate({
                    path: 'cartItems.productId',
                    model: 'products',
                })
                .lean()
        } catch (error) {
            throw new Error(`Error al obtener los carritos: ${error.message}`)
        }
    }

    async showUserCart(userId) {
        try {
            return await CartModel.findOne({ user: userId })
                .populate({
                    path: 'cartItems.productId',
                    model: 'products',
                })
                .lean()
        } catch (error) {
            throw new Error(
                `Error al obtener el carrito del usuario: ${error.message}`
            )
        }
    }

    async showCartById(cartId, userId, userRole) {
        try {
            const cart = await CartModel.findById(cartId)
                .populate({
                    path: 'cartItems.productId',
                    model: 'products',
                })
                .lean()

            if (userRole !== 'admin') {
                throw new Error('No tienes permisos para ver este carrito')
            }

            return cart
        } catch (error) {
            throw new Error(`Error al obtener el carrito: ${error.message}`)
        }
    }

    async addProduct(cartId, productId, quantity) {
        try {
            const existingCartItem = await CartModel.findOne({
                _id: cartId,
                'cartItems.productId': productId,
            })

            if (existingCartItem) {
                const updatedCart = await CartModel.findOneAndUpdate(
                    { _id: cartId, 'cartItems.productId': productId },
                    { $inc: { 'cartItems.$.quantity': quantity } },
                    { new: true, useFindAndModify: false }
                )
                return updatedCart
            } else {
                const updatedCart = await CartModel.findByIdAndUpdate(
                    cartId,
                    {
                        $push: {
                            cartItems: { productId, quantity },
                        },
                    },
                    { new: true, useFindAndModify: false }
                )
                return updatedCart
            }
        } catch (error) {
            throw new Error(`Error al actualizar el carrito: ${error.message}`)
        }
    }

    async deleteAllProducts(cartId) {
        try {
            const updatedCart = await CartModel.findByIdAndUpdate(
                cartId,
                { $set: { cartItems: [] } },
                { new: true, useFindAndModify: false }
            )
            return updatedCart
        } catch (error) {
            throw new Error(
                `Error al eliminar todos los productos: ${error.message}`
            )
        }
    }

    async deleteProduct(cartId, productId) {
        try {
            const updatedCart = await CartModel.findOneAndUpdate(
                { _id: cartId, 'cartItems.productId': productId },
                { $inc: { 'cartItems.$.quantity': -1 } },
                { new: true, useFindAndModify: false }
            )

            if (updatedCart.cartItems[0].quantity === 0) {
                const finalCart = await CartModel.findByIdAndUpdate(
                    cartId,
                    { $pull: { cartItems: { productId } } },
                    { new: true, useFindAndModify: false }
                )
                return finalCart
            } else {
                return updatedCart
            }
        } catch (error) {
            throw new Error(
                `Error al eliminar el producto del carrito: ${error.message}`
            )
        }
    }

    async updateCartItem(userId, productId, quantity) {
        try {
            if (!quantity || isNaN(quantity) || quantity <= 0) {
                throw new Error('Cantidad de producto no válida')
            }

            let userCart = await this.createCart(userId)

            const existingCartItem = userCart.cartItems.find(
                (item) => item.productId === productId
            )

            if (existingCartItem) {
                existingCartItem.quantity += quantity
            } else {
                userCart.cartItems.push({ productId, quantity })
            }

            await userCart.save()

            return userCart
        } catch (error) {
            throw new Error(`Error al actualizar el carrito: ${error.message}`)
        }
    }

    async deleteAllCarts() {
        try {
            return await CartModel.deleteMany({})
        } catch (error) {
            throw new Error(
                `Error al eliminar todos los carritos: ${error.message}`
            )
        }
    }
}
