import { Router } from "express";

export const webRouter = Router();

webRouter.get("/", (req, res) => {
  res.render("index", { productos: "productos" });
});

webRouter.get("/realtimeproducts", (req, res) => {
  res.render("realTimeProducts", { titulo: "Productos en Tiempo Real" });
});
