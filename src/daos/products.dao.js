import { ProductModel } from '../models/ProductsMongoose.js'

export class ProductDAO {
    async getPaginatedProducts(page, limit, sort, sortOrder, search, category) {
        try {
            let query = {}

            // Aplicar búsqueda si se especifica
            if (search) {
                // Buscar en el título y la descripción del producto
                query = {
                    ...query,
                    $or: [{ title: { $regex: search, $options: 'i' } }],
                }
            }

            // Aplicar filtro si se especifica
            if (category && category !== 'All') {
                // Agregar filtro de categoría si está presente y no es 'All'
                query = { ...query, category: category }
            }

            // Aplicar orden y dirección
            const sortOptions = {}
            sortOptions[sort] = sortOrder === 'asc' ? 1 : -1

            // Obtener productos paginados de la base de datos
            const products = await ProductModel.find(query)
                .sort(sortOptions)
                .skip((page - 1) * limit)
                .limit(limit)
                .exec()
            console.log(products)
            return products
        } catch (error) {
            throw new Error(
                `Error al obtener los productos paginados: ${error.message}`
            )
        }
    }

    async countProducts() {
        try {
            // Obtener el recuento total de productos en la base de datos
            const count = await ProductModel.countDocuments()
            return count
        } catch (error) {
            throw new Error('Error al obtener el recuento total de productos')
        }
    }

    async getAllProducts() {
        try {
            const products = await ProductModel.find().lean()
            return products
        } catch (error) {
            throw new Error(
                `Error en ProductDAO.getAllProducts: ${error.message}`
            )
        }
    }

    async getProductById(productId) {
        try {
            const product = await ProductModel.findById(productId)
            return product
        } catch (error) {
            throw new Error(
                `Error en ProductDAO.getProductById: ${error.message}`
            )
        }
    }

    async createProduct(productData) {
        try {
            const createdProduct = await ProductModel.create(productData)
            return createdProduct
        } catch (error) {
            throw new Error(
                `Error en ProductDAO.createProduct: ${error.message}`
            )
        }
    }

    async modifyProductById(productId, updatedData) {
        try {
            const modifiedProduct = await ProductModel.findByIdAndUpdate(
                productId,
                { $set: updatedData },
                { new: true }
            )
            return modifiedProduct
        } catch (error) {
            throw new Error(
                `Error en ProductDAO.modifyProductById: ${error.message}`
            )
        }
    }

    async removeProductById(productId) {
        try {
            const deletedProduct =
                await ProductModel.findByIdAndDelete(productId)
            return deletedProduct
        } catch (error) {
            throw new Error(
                `Error en ProductDAO.removeProductById: ${error.message}`
            )
        }
    }

    async changeProductPhoto(productId, newPhotoPath) {
        try {
            const modifiedProduct = await ProductModel.findByIdAndUpdate(
                productId,
                { $set: { photoUrl: newPhotoPath } },
                { new: true }
            )
            return modifiedProduct
        } catch (error) {
            throw new Error(
                `Error en ProductDAO.changeProductPhoto: ${error.message}`
            )
        }
    }

    // Elimina todos los productos
    async deleteAllProducts() {
        try {
            return await ProductModel.deleteMany({})
        } catch (error) {
            throw new Error(
                `Error al eliminar todos los productos: ${error.message}`
            )
        }
    }
}

export const productDAO = new ProductDAO()

// async getProducts(page, limit, search, sortedBy, sortOrder, categoryList) {
//     try {
//         const products = await ProductModel.find({
//             title: { $regex: search, $options: 'i' },
//             category: { $in: categoryList },
//         })
//             .sort({ [sortedBy]: sortOrder === 'desc' ? -1 : 1 })
//             .skip(page * limit)
//             .limit(limit)

//         const total = await ProductModel.countDocuments({
//             category: { $in: categoryList },
//             title: { $regex: search, $options: 'i' },
//         })

//         return {
//             products,
//             total,
//             totalPages: Math.ceil(total / limit),
//             hasPrevPage: page > 1,
//             hasNextPage: page < Math.ceil(total / limit),
//             prevPage: page > 1 ? page - 1 : null,
//             nextPage: page < Math.ceil(total / limit) ? page + 1 : null,
//         }
//     } catch (error) {
//         throw new Error(`Error en ProductDAO.getProducts: ${error.message}`)
//     }
// }

// async getPaginatedProducts(
//     page,
//     limit,
//     search,
//     sortField,
//     sortOrder,
//     category
// ) {
//     try {
//         category =
//             category === 'All'
//                 ? await ProductModel.distinct('category').exec()
//                 : typeof category === 'string'
//                   ? category.split(',')
//                   : await ProductModel.distinct('category').exec()

//         const validSortFields = ['price', 'status', 'stock']
//         if (!validSortFields.includes(sortField)) {
//             sortField = 'price'
//         }

//         const sortBy = {}
//         sortBy[sortField] = sortOrder === 'desc' ? -1 : 1

//         const query = {
//             title: { $regex: search, $options: 'i' },
//             category: { $in: category },
//         }

//         const products = await ProductModel.find(query)
//             .sort(sortBy)
//             .skip((page - 1) * limit)
//             .limit(limit)
//             .lean()

//         return products
//     } catch (error) {
//         throw new Error(
//             `Error en ProductDAO.getPaginatedProducts: ${error.message}`
//         )
//     }
// }

// async countProducts(search, category) {
//     try {
//         // Procesa las categorías
//         category =
//             category === 'All'
//                 ? await ProductModel.distinct('category').exec()
//                 : typeof category === 'string'
//                   ? category.split(',')
//                   : await ProductModel.distinct('category').exec()

//         // Construye la consulta para la base de datos
//         const query = {
//             title: { $regex: search, $options: 'i' },
//             category: { $in: category },
//         }

//         // Cuenta los documentos que cumplen con la consulta
//         const total = await ProductModel.countDocuments(query)
//         return total
//     } catch (error) {
//         throw new Error(
//             `Error en ProductDAO.countProducts: ${error.message}`
//         )
//     }
// }
