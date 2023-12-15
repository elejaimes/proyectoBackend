import { Router, json, urlencoded } from "express";
import { apiProductsRouter } from "./api.products.router.js";
import { apiCartsRouter } from "./api.carts.router.js";
import { initRouter } from "../init.router.js";
import { apiSessionsRouter } from "./api.sessions.router.js";
import { apiUsersRouter } from "./api.users.router.js";

export const apiRouter = Router();

apiRouter.use(json());
apiRouter.use(urlencoded({ extended: true }));

apiRouter.use("/products", apiProductsRouter);
apiRouter.use("/carts", apiCartsRouter);
apiRouter.use("/dbInit", initRouter);
apiRouter.use("/sessions", apiSessionsRouter);
apiRouter.use("/users", apiUsersRouter);
