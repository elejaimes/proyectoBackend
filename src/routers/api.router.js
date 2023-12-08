import { Router, json } from "express";
import { apiProductsRouter } from "./api.products.router.js";
import { apiCartsRouter } from "./api.carts.router.js";
import { initRouter } from "./init.router.js";

export const apiRouter = Router();

apiRouter.use(json());
apiRouter.use("/products", apiProductsRouter);
apiRouter.use("/carts", apiCartsRouter);
apiRouter.use("/dbInit", initRouter);
