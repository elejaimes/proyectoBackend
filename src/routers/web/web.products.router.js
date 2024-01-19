import { Router } from "express";
import {
  getCategoriesPage,
  getPaginatedProducts,
  getProductDetailPage,
} from "../../controllers/web/products.controllers.js";

export const webProductsRouter = Router();

webProductsRouter.get("/products", getPaginatedProducts);

webProductsRouter.get("/categories", getCategoriesPage);

webProductsRouter.get("/products/:pid", getProductDetailPage);
