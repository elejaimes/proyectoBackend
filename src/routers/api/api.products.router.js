import { Router } from "express";
import { extractFile } from "../../middlewares/files.js";
import {
  changeProductPhoto,
  createProduct,
  getAllProducts,
  getCategories,
  getProductById,
  getProducts,
  modifyProductById,
  removeProductById,
} from "../../controllers/products.controllers.js";

// Creación de una instancia de Router para manejar las rutas relacionadas con los productos
export const apiProductsRouter = Router();

// Ruta para obtener productos ("/api/products")
apiProductsRouter.get("/", getProducts);

// Ruta para obtener todas las categorías ("/cat")
apiProductsRouter.get("/cat", getCategories);

// Ruta para obtener todos los productos ("/all")
apiProductsRouter.get("/all", getAllProducts);

// Ruta para obtener un producto por su ID ("/:pid")
apiProductsRouter.get("/:pid", getProductById);

// Ruta para agregar un nuevo producto ("/")
apiProductsRouter.post("/", extractFile("photoUrl"), createProduct);

// Ruta para actualizar un producto por su ID ("/:pid")
apiProductsRouter.put("/:pid", modifyProductById);

// Ruta para eliminar un producto por su ID ("/:pid")
apiProductsRouter.delete("/:pid", removeProductById);

// Ruta para actualizar la foto de un producto por su ID ("/:pid/photoUrl")
apiProductsRouter.post(
  "/:pid/photoUrl",
  extractFile("photoUrl"),
  changeProductPhoto
);
