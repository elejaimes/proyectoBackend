import { Router } from "express";

export const webRouter = Router();

webRouter.get("/", (req, res) => {
  res.render("index", {
    titulo: "POSTRES - PANADERÍA - HELADERIA. BACKEND - SEGUNDA PREENTREGA",
  });
});

webRouter.get("/products", (req, res) => {
  res.render("products");
});

webRouter.get("/carts", (req, res) => {
  res.render("carts");
});
