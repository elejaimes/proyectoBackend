import { Router } from "express";
import { webProductsRouter } from "./web.products.router.js";
import { webCartsRouter } from "./web.carts.router.js";
import { webSessionRouter } from "./web.session.router.js";
import { webUsersRouter } from "./web.users.router.js";

export const webRouter = Router();

webRouter.get("/", (req, res) => {
  res.render("home", {
    title: "POSTRES - PANADERÍA - HELADERIA. BACKEND - SEGUNDA PREENTREGA",
  });
});

webRouter.use(webProductsRouter);
webRouter.use(webCartsRouter);
webRouter.use(webSessionRouter);
webRouter.use(webUsersRouter);
webRouter.use((req, res) => res.status(404).json({ message: "Not Found" }));
