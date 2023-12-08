import { Router } from "express";
import { extractFile } from "../middlewares/files.js";
import { ProductModel } from "../models/ProductsMongoose.js";

// Creación de una instancia de Router para manejar las rutas relacionadas con los productos
export const apiProductsRouter = Router();

apiProductsRouter.get("/", async (req, res) => {
  let options = {};

  const filter = req.query.filter ? { category: req.query.filter } : {};
  const prodPerPage = req.query.prodPerPage
    ? { limit: req.query.prodPerPage }
    : { limit: 10 };
  const pag = req.query.pag ? { page: req.query.pag } : { page: 1 };
  const order = req.query.order ? { sort: { price: req.query.order } } : {};

  options = { ...filter, ...prodPerPage, ...pag, ...order };

  try {
    const paginated = await products.paginate({}, options);

    const resources = {
      status: "success",
      payload: paginated.docs,
      totalPages: paginated.totalPages,
      prevPage: paginated.prevPage,
      nextPage: paginated.nextPage,
      page: paginated.page,
      hasPrevPage: paginated.hasPrevPage,
      hasNextPage: paginated.hasNextPage,
      prevLink: "",
      nextLink: "",
    };

    res.json(resources);
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
});

// Ruta para obtener todos los productos ("/")
apiProductsRouter.get("/", async (req, res) => {
  const products = await ProductModel.find();
  res.json(products);
});

// Ruta para obtener un producto por su ID ("/:pid")
apiProductsRouter.get("/:pid", async (req, res) => {
  const product = await ProductModel.findById(req.params.pid);
  if (!product) {
    return res.status(404).json({ message: "Producto no encontrado" });
  }
  res.json(product);
});

// Ruta para agregar un nuevo producto ("/")
apiProductsRouter.post("/", extractFile("photoUrl"), async (req, res) => {
  try {
    if (req.file) {
      req.body.photoUrl = req.file.path;
    }
    const createdProduct = await ProductModel.create(req.body);
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Ruta para actualizar un producto por su ID ("/:pid")
apiProductsRouter.put("/:pid", async (req, res) => {
  const modifiedProduct = await ProductModel.findByIdAndUpdate(
    req.params.pid,
    { $set: req.body },
    { new: true }
  );
  if (!modifiedProduct) {
    return res.status(400).json({ message: "producto no encontrado" });
  }
  res.json(modifiedProduct);
});

// Ruta para eliminar un producto por su ID ("/:pid")
apiProductsRouter.delete("/:pid", async (req, res) => {
  const deletedProduct = await ProductModel.findByIdAndDelete(req.params.pid);
  if (!deletedProduct) {
    return res.status(404).json({ message: "producto no encontrado" });
  }
  res.json(deletedProduct);
});

apiProductsRouter.post(
  "/:pid/photoUrl",
  extractFile("photoUrl"),
  async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: "debe cargar una foto válida" });
    }
    const modifiedProduct = await ProductModel.findByIdAndUpdate(
      req.params.pid,
      { $set: { photoUrl: req.file.path } },
      { new: true }
    );
    if (!modifiedProduct) {
      return res.status(400).json({ message: "producto no encontrado" });
    }
    res.json(modifiedProduct);
  }
);
