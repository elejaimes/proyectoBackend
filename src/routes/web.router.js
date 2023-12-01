// Importación del módulo Router de Express
import { Router } from "express";

// Creación de una instancia de Router para manejar rutas web
export const webRouter = Router();

// Ruta para la página de inicio ("/")
webRouter.get("/", (req, res) => {
  // Renderizar la vista "index" y pasar la variable "productos" con el valor "productos"
  res.render("index", { productos: "productos" });
});

// Ruta para la página de productos en tiempo real ("/realtimeproducts")
webRouter.get("/realtimeproducts", (req, res) => {
  // Renderizar la vista "realTimeProducts" y pasar la variable "titulo" con el valor "Productos en Tiempo Real"
  res.render("realTimeProducts", { titulo: "Productos en Tiempo Real" });
});
