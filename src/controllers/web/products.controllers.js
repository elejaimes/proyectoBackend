import { ProductModel } from "../../models/ProductsMongoose.js";

export const getPaginatedProducts = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit, 10) || 6, 1);
    const search = req.query.search || "";
    const sortField = req.query.sort || "Price";
    const sortOrder = req.query.order || "asc";
    const category = req.query.category || "All";

    const result = await ProductModel.getPaginatedProducts(
      page,
      limit,
      search,
      sortField,
      sortOrder,
      category
    );

    res.render("products", {
      products: result.products,
      response: {
        status: "success",
        totalPages: result.totalPages,
        prevPage: result.prevPage,
        nextPage: result.nextPage,
        pages: result.pages,
        page: result.page,
        hasPrevPage: result.hasPrevPage,
        hasNextPage: result.hasNextPage,
        prevLink: result.prevLink,
        nextLink: result.nextLink,
      },
      registeredUser: req.user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).render("error", { error });
  }
};

export const getCategoriesPage = async (req, res) => {
  try {
    const categories = await ProductModel.getCategories();

    res.render("categoriesPage", { categories });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

// Define la función del controlador para obtener el detalle de un producto por ID
export const getProductDetailPage = async (req, res) => {
  try {
    const product = await ProductModel.getProductById(req.params.pid);
    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }
    res.render("productDetailPage", { product });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};
