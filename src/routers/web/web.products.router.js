import { Router } from 'express'
import {
    getPaginatedProducts,
    getProductDetailPage,
} from '../../controllers/web/products.controllers.js'

export const webProductsRouter = Router()

webProductsRouter.get('/products', getPaginatedProducts)

webProductsRouter.get('/products/:pid', getProductDetailPage)
