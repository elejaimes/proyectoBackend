import { Router } from 'express'
import { extractFile } from '../../middlewares/files.js'
import {
    changeProductPhoto,
    createProduct,
    getAllProducts,
    getPaginatedProducts,
    getProductById,
    modifyProductById,
    removeProductById,
} from '../../controllers/api/products.controllers.js'
import { loggedAdmin } from '../../middlewares/auth.js'

// Creación de una instancia de Router para manejar las rutas relacionadas con los productos
export const apiProductsRouter = Router()

// Ruta para obtener productos ("/api/products")
apiProductsRouter.get('/', getPaginatedProducts)

// Ruta para obtener todos los productos ("/all")
apiProductsRouter.get('/all', getAllProducts, loggedAdmin)

// Ruta para obtener un producto por su ID ("/:pid")
apiProductsRouter.get('/:pid', getProductById, loggedAdmin)

// Ruta para agregar un nuevo producto ("/")
apiProductsRouter.post('/', extractFile('photoUrl'), createProduct, loggedAdmin)

// Ruta para actualizar un producto por su ID ("/:pid")
apiProductsRouter.put('/:pid', modifyProductById, loggedAdmin)

// Ruta para eliminar un producto por su ID ("/:pid")
apiProductsRouter.delete('/:pid', removeProductById, loggedAdmin)

// Ruta para actualizar la foto de un producto por su ID ("/:pid/photoUrl")
apiProductsRouter.post(
    '/:pid/photoUrl',
    extractFile('photoUrl'),
    changeProductPhoto,
    loggedAdmin
)
