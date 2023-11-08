import { Router } from "express";
import { productManager } from "../index.js";

const productsRouter = Router();

productsRouter.get("/", async (req, res) => {
  try {
    const { limit } = req.query;
    const products = await productManager.getProducts();
    if (limit) {
      const limitedProducts = products.slice(0, limit);
      return res.json(limitedProducts);
    }
    return res.json(products);
  } catch (error) {
    console.log(error);
    res.send("ERROR al intentar recibir los productos");
  }
});

productsRouter.get("/:pid", async (req, res) => {
  const { pid } = req.params;
  try {
    const products = await productManager.getProductById(pid);
    res.json(products);
  } catch (error) {
    console.log(error);
    res.send(`ERROR al intentar recibir el producto con el ID ${pid}`);
  }
});

productsRouter.post("/", async (req, res) => {
  try {
    const {
      title,
      description,
      code,
      price,
      status = true,
      stock,
      category,
      thumbnail,
    } = req.body;
    const response = await productManager.addProduct({
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnail,
    });
    res.json(response);
  } catch (error) {
    console.log(error);
    res.send("ERROR al intentar obtener el producto");
  }
});

productsRouter.put("/:pid", async (req, res) => {
  const { pid } = req.params;
  try {
    const {
      title,
      description,
      code,
      price,
      status = true,
      stock,
      category,
      thumbnail,
    } = req.body;
    const response = await productManager.updateproduct(pid, {
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnail,
    });
    res.json(response);
  } catch (error) {
    console.log(error);
    res.send(`ERROR al intentar actualizar el producto con el ID ${pid}`);
  }
});

productsRouter.delete("/:pid", async (req, res) => {
  const { pid } = req.params;
  try {
    await productManager.deleteProduct(pid);
    res.send("Producto eliminado con éxito");
  } catch (error) {
    console.log(error);
    res.send(`ERROR al intentar eliminar el producto con el ID ${pid}`);
  }
});

export { productsRouter };
