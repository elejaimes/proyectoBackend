import { ProductModel } from "../models/ProductsMongoose.js";

export async function getProducts(req, res, next) {
  try {
    const page = parseInt(req.query.page) - 1 || 0;
    const limit = parseInt(req.query.limit) || 5;
    const search = req.query.search || "";
    const sort = req.query.sort || "Price";
    const category = req.query.category || "All";

    const productsResponse = await ProductModel.getProducts(
      page,
      limit,
      search,
      sort,
      category
    );

    res.status(200).json(productsResponse);
  } catch (error) {
    next(error);
  }
}
export async function getCategories(req, res, next) {
  try {
    const categories = await ProductModel.getCategories();
    res.json(categories);
  } catch (error) {
    next(error);
  }
}
export async function getAllProducts(req, res, next) {
  try {
    const products = await ProductModel.getAllProducts();
    res.json(products);
  } catch (error) {
    next(error);
  }
}
export async function getProductById(req, res, next) {
  try {
    const { pid } = req.params;
    const product = await ProductModel.getProductById(pid);

    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    res.json(product);
  } catch (error) {
    next(error);
  }
}
export async function createProduct(req, res, next) {
  try {
    if (req.file) {
      req.body.photoUrl = req.file.path;
    }

    const createdProduct = await ProductModel.createProduct(req.body);
    res.status(201).json(createdProduct);
  } catch (error) {
    next(error);
  }
}
export async function modifyProductById(req, res, next) {
  try {
    const { pid } = req.params;
    const updatedData = req.body;

    const modifiedProduct = await ProductModel.modifyProductById(
      pid,
      updatedData
    );
    if (!modifiedProduct) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    res.json(modifiedProduct);
  } catch (error) {
    next(error);
  }
}
export async function removeProductById(req, res, next) {
  try {
    const { pid } = req.params;

    const deletedProduct = await ProductModel.removeProductById(pid);
    if (!deletedProduct) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    res.json(deletedProduct);
  } catch (error) {
    next(error);
  }
}
export async function changeProductPhoto(req, res, next) {
  try {
    const { pid } = req.params;

    if (!req.file) {
      return res.status(400).json({ message: "Debe cargar una foto válida" });
    }

    const newPhotoPath = req.file.path;
    const modifiedProduct = await ProductModel.changeProductPhoto(
      pid,
      newPhotoPath
    );

    if (!modifiedProduct) {
      return res.status(400).json({ message: "Producto no encontrado" });
    }

    res.json(modifiedProduct);
  } catch (error) {
    next(error);
  }
}
