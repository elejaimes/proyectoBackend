import { Router } from "express";
import { extractFile } from "../../middlewares/files.js";
import { ProductModel } from "../../models/ProductsMongoose.js";

// Creación de una instancia de Router para manejar las rutas relacionadas con los productos
export const apiProductsRouter = Router();

// Ruta para obtener todos los productos con paginación, filtrado y ordenamiento ("/")

apiProductsRouter.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) - 1 || 0;
    const limit = parseInt(req.query.limit) || 5;
    const search = req.query.search || "";
    let sort = req.query.sort || "Price";
    let category = req.query.category || "All";

    const categoryOptions = [
      "Panadería",
      "Pastelería",
      "Postres",
      "Repostería",
      "Heladería",
      "Bebidas",
    ];

    category === "All"
      ? (category = [...categoryOptions])
      : (category = req.query.category.split(","));
    req.query.sort ? (sort = req.query.sort.split(",")) : (sort = [sort]);

    let sortBy = {};
    if (sort[1]) {
      sortBy[sort[0]] = sort[1];
    } else {
      if (sort[0] === "price") {
        sortBy[sort[0]] = "asc";
      } else {
        sortBy[sort[0]] = "asc";
      }
    }

    const products = await ProductModel.find({
      title: { $regex: search, $options: "i" },
      category: { $in: category },
    })
      .sort(sortBy)
      .skip(page * limit)
      .limit(limit);

    const total = await ProductModel.countDocuments({
      category: { $in: [...category] },
      title: { $regex: search, $options: "i" },
    });

    const response = {
      error: false,
      total,
      page: page + 1,
      limit,
      category: categoryOptions,
      products,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
});

// apiProductsRouter.get("/", async (req, res) => {
//   let options = {};

//   const filter = req.query.filter ? { category: req.query.filter } : {};
//   const prodPerPage = req.query.prodPerPage
//     ? { limit: req.query.prodPerPage }
//     : { limit: 10 };
//   const pag = req.query.pag ? { page: req.query.pag } : { page: 1 };
//   const order = req.query.order ? { sort: { price: req.query.order } } : {};

//   options = { ...filter, ...prodPerPage, ...pag, ...order };

//   try {
//     const paginated = await ProductModel.paginate({}, options);

//     const resources = {
//       status: "success",
//       payload: paginated.docs,
//       totalPages: paginated.totalPages,
//       prevPage: paginated.prevPage,
//       nextPage: paginated.nextPage,
//       page: paginated.page,
//       hasPrevPage: paginated.hasPrevPage,
//       hasNextPage: paginated.hasNextPage,
//       prevLink: "",
//       nextLink: "",
//     };

//     res.json(resources);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ status: "error", message: "Internal Server Error" });
//   }
// });

// Ruta para obtener todas las categorías ("/cat")
apiProductsRouter.get("/cat", async (req, res) => {
  const productsCategory = await ProductModel.aggregate([
    { $group: { _id: "$category" } },
  ]);
  res.json(productsCategory);
});

// Ruta para obtener todos los productos ("/all")
apiProductsRouter.get("/all", async (req, res) => {
  const products = await ProductModel.find().lean();
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

// Ruta para actualizar la foto de un producto por su ID ("/:pid/photoUrl")
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
