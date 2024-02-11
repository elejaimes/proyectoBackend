import { productDAO } from '../daos/products.dao.js'

export class ProductService {
    async getPaginatedProducts(page, limit, sort, sortOrder, search, filter) {
        try {
            // Lógica para obtener los productos paginados de la base de datos
            const products = await productDAO.getPaginatedProducts(
                page,
                limit,
                sort,
                sortOrder,
                search,
                filter
            )
            return products
        } catch (error) {
            throw new Error(
                `Error al obtener los productos paginados: ${error.message}`
            )
        }
    }

    async getTotalProductsCount() {
        try {
            // Obtener el recuento total de productos utilizando el DAO
            const count = await productDAO.countProducts()
            return count
        } catch (error) {
            throw new Error(
                'Error en el servicio al obtener el recuento total de productos'
            )
        }
    }

    async getAllProducts() {
        try {
            const products = await productDAO.getAllProducts()
            return products
        } catch (error) {
            throw new Error(
                `Error en ProductService.getAllProducts: ${error.message}`
            )
        }
    }

    async getProductById(productId) {
        try {
            const product = await productDAO.getProductById(productId)
            return product
        } catch (error) {
            throw new Error(
                `Error en ProductService.getProductById: ${error.message}`
            )
        }
    }

    async createProduct(productData) {
        try {
            const createdProduct = await productDAO.createProduct(productData)
            return createdProduct
        } catch (error) {
            throw new Error(
                `Error en ProductService.createProduct: ${error.message}`
            )
        }
    }

    async modifyProductById(productId, updatedData) {
        try {
            const modifiedProduct = await productDAO.modifyProductById(
                productId,
                updatedData
            )
            return modifiedProduct
        } catch (error) {
            throw new Error(
                `Error en ProductService.modifyProductById: ${error.message}`
            )
        }
    }

    async removeProductById(productId) {
        try {
            const deletedProduct = await productDAO.removeProductById(productId)
            return deletedProduct
        } catch (error) {
            throw new Error(
                `Error en ProductService.removeProductById: ${error.message}`
            )
        }
    }

    async changeProductPhoto(productId, newPhotoPath) {
        try {
            const modifiedProduct = await productDAO.changeProductPhoto(
                productId,
                newPhotoPath
            )
            return modifiedProduct
        } catch (error) {
            throw new Error(
                `Error en ProductService.changeProductPhoto: ${error.message}`
            )
        }
    }

    async deleteAllProducts() {
        try {
            return await productDAO.deleteAllProducts()
        } catch (error) {
            throw new Error(
                `Error al eliminar todos los productos: ${error.message}`
            )
        }
    }
}

export const productService = new ProductService()

// static async getProducts(page, limit, search, sort, category) {
//     try {
//         const { sortedBy, sortOrder, categoryList } =
//             ProductService.processInputOptions(sort, category)

//         const {
//             products,
//             total,
//             totalPages,
//             hasPrevPage,
//             hasNextPage,
//             prevPage,
//             nextPage,
//             pages,
//         } = await productDAO.getAllProducts(
//             page,
//             limit,
//             search,
//             sortedBy,
//             sortOrder,
//             categoryList
//         )

//         const response = {
//             error: false,
//             total,
//             page: page + 1,
//             limit,
//             category: categoryOptions,
//             products,
//             totalPages,
//             hasPrevPage,
//             hasNextPage,
//             prevPage,
//             nextPage,
//             pages: ProductService.generatePageLinks(
//                 page,
//                 totalPages,
//                 search,
//                 sortedBy,
//                 sortOrder,
//                 categoryList
//             ),
//         }

//         return response
//     } catch (error) {
//         throw new Error(
//             `Error en ProductService.getProducts: ${error.message}`
//         )
//     }
// }

// static processInputOptions(sort, category) {
//     const categoryOptions = [
//         'Panadería',
//         'Pastelería',
//         'Postres',
//         'Repostería',
//         'Heladería',
//         'Bebidas',
//     ]

//     let categoryList
//     if (category === 'All') {
//         categoryList = [...categoryOptions]
//     } else {
//         categoryList =
//             typeof category === 'string'
//                 ? category.split(',')
//                 : categoryOptions
//     }

//     let sortedBy
//     let sortOrder
//     if (sort) {
//         ;[sortedBy, sortOrder] = sort.split(',')
//         sortOrder = sortOrder || 'asc'
//     } else {
//         sortedBy = 'Price'
//         sortOrder = 'asc'
//     }

//     return { sortedBy, sortOrder, categoryList }
// }

// static generatePageLinks(
//     page,
//     totalPages,
//     search,
//     sortedBy,
//     sortOrder,
//     categoryList
// ) {
//     const pages = []
//     for (let i = 1; i <= totalPages; i++) {
//         pages.push({
//             number: i,
//             link: `/products?page=${i}&limit=${limit}&search=${search}&category=${categoryList.join(
//                 ','
//             )}&sort=${sortedBy}&order=${sortOrder}`,
//             isActive: i === page,
//         })
//     }
//     return pages
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
//         const categoryOptions = [
//             'Panadería',
//             'Pastelería',
//             'Postres',
//             'Repostería',
//             'Heladería',
//             'Bebidas',
//         ]

//         category =
//             category === 'All'
//                 ? [...categoryOptions]
//                 : typeof category === 'string'
//                   ? category.split(',')
//                   : categoryOptions

//         const validSortFields = ['price', 'status', 'stock']
//         if (!validSortFields.includes(sortField)) {
//             sortField = 'price'
//         }

//         const products = await productDAO.getPaginatedProducts(
//             page,
//             limit,
//             search,
//             sortField,
//             sortOrder,
//             category
//         )

//         const total = await productDAO.countProducts(
//             page,
//             limit,
//             search,
//             sortField,
//             sortOrder,
//             category
//         )

//         const totalPages = Math.ceil(total / limit)
//         const hasPrevPage = page > 1
//         const hasNextPage = page < totalPages
//         const prevPage = hasPrevPage ? page - 1 : null
//         const nextPage = hasNextPage ? page + 1 : null
//         const pages = []
//         for (let i = 1; i <= totalPages; i++) {
//             pages.push({
//                 number: i,
//                 link: `/products?page=${i}&limit=${limit}&search=${search}&category=${category.join(
//                     ','
//                 )}&sort=${sortField}&order=${sortOrder}`,
//                 isActive: i === page,
//             })
//         }

//         return {
//             products,
//             total,
//             totalPages,
//             hasPrevPage,
//             hasNextPage,
//             prevPage,
//             nextPage,
//             pages,
//         }
//     } catch (error) {
//         throw new Error(
//             `Error en ProductService.getPaginatedProducts: ${error.message}`
//         )
//     }
// }
