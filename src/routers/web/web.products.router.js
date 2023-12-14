import { Router } from "express";
import { ProductModel } from "../../models/ProductsMongoose.js";

export const webProductsRouter = Router();

webProductsRouter.get("/products", async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit, 10) || 6, 1);
    const search = req.query.search || "";
    let sortField = req.query.sort || "Price";
    let sortOrder = req.query.order || "asc";
    let category = req.query.category || "All";

    const categoryOptions = [
      "Panadería",
      "Pastelería",
      "Postres",
      "Repostería",
      "Heladería",
      "Bebidas",
    ];

    category =
      category === "All"
        ? [...categoryOptions]
        : typeof category === "string"
        ? category.split(",")
        : categoryOptions;

    const validSortFields = ["price", "status", "stock"];
    if (!validSortFields.includes(sortField)) {
      sortField = "price";
    }

    const sortBy = {};
    sortBy[sortField] = sortOrder === "desc" ? -1 : 1;

    const query = {
      title: { $regex: search, $options: "i" },
      category: { $in: category },
    };

    const products = await ProductModel.find(query)
      .sort(sortBy)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    const total = await ProductModel.countDocuments(query);

    const totalPages = Math.ceil(total / limit);
    const hasPrevPage = page > 1;
    const hasNextPage = page < totalPages;
    const prevPage = hasPrevPage ? page - 1 : null;
    const nextPage = hasNextPage ? page + 1 : null;
    const prevLink = hasPrevPage
      ? `/products?page=${prevPage}&limit=${limit}&search=${search}&category=${category.join(
          ","
        )}&sort=${sortField}&order=${sortOrder}`
      : null;
    const nextLink = hasNextPage
      ? `/products?page=${nextPage}&limit=${limit}&search=${search}&category=${category.join(
          ","
        )}&sort=${sortField}&order=${sortOrder}`
      : null;
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push({
        number: i,
        link: `/products?page=${i}&limit=${limit}&search=${search}&category=${category.join(
          ","
        )}&sort=${sortField}&order=${sortOrder}`,
        isActive: i === page,
      });
    }

    const response = {
      status: "success",
      payload: products,
      totalPages,
      prevPage,
      nextPage,
      pages,
      page,
      hasPrevPage,
      hasNextPage,
      prevLink,
      nextLink,
    };

    res.render("products", { products, response });
  } catch (error) {
    console.error(error);
    res.status(500).render("error", { error });
  }
});

webProductsRouter.get("/cat", async (req, res) => {
  try {
    const categories = await ProductModel.aggregate([
      { $group: { _id: "$category" } },
      { $project: { _id: 0, category: "$_id" } },
    ]);

    res.render("categoriesPage", { categories });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

webProductsRouter.get("/products/:pid", async (req, res) => {
  try {
    const product = await ProductModel.findById(req.params.pid);
    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }
    res.render("productDetailPage", { product });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});
