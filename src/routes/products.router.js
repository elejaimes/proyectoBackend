import { Router } from "express";
import { productManager } from "../index.js";

// Creación de una instancia de Router para manejar las rutas relacionadas con los productos
const productsRouter = Router();

// Ruta para obtener todos los productos ("/")
productsRouter.get("/", async (req, res) => {
  try {
    // Extraer el parámetro "limit" de la consulta, si existe
    const { limit } = req.query;
    // Obtener la lista completa de productos desde productManager
    const products = await productManager.getAll();
    // Verificar si se proporcionó el parámetro "limit"
    if (limit) {
      // Limitar la lista de productos según el valor de "limit"
      const limitedProducts = products.slice(0, limit);
      return res.json(limitedProducts);
    }
    // Enviar la lista completa de productos como respuesta
    return res.json(products);
  } catch (error) {
    // Manejar cualquier error que ocurra durante la obtención de productos
    console.log(error);
    res.send("ERROR al intentar recibir los productos");
  }
});

// Ruta para obtener un producto por su ID ("/:pid")
productsRouter.get("/:pid", async (req, res) => {
  const { pid } = req.params;
  try {
    // Obtener el producto con el ID proporcionado desde productManager
    const products = await productManager.getProductById(pid);
    // Enviar el producto como respuesta
    res.json(products);
  } catch (error) {
    // Manejar cualquier error que ocurra durante la obtención de un producto por ID
    console.log(error);
    res.send(`ERROR al intentar recibir el producto con el ID ${pid}`);
  }
});

// Ruta para agregar un nuevo producto ("/")
productsRouter.post("/", async (req, res) => {
  try {
    // Extraer datos del cuerpo de la solicitud (req.body) para crear un nuevo producto
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
    // Agregar el nuevo producto utilizando productManager
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
    // Enviar la respuesta como JSON
    res.json(response);
  } catch (error) {
    console.log(error);
    res.send("ERROR al intentar obtener el producto");
  }
});

// Ruta para actualizar un producto por su ID ("/:pid")
productsRouter.put("/:pid", async (req, res) => {
  const { pid } = req.params;
  try {
    // Extraer datos del cuerpo de la solicitud (req.body) para actualizar un producto
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
    // Actualizar el producto utilizando productManager
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
    // Enviar la respuesta como JSON
    res.json(response);
  } catch (error) {
    // Manejar cualquier error que ocurra durante la actualización de un producto por ID
    console.log(error);
    res.send(`ERROR al intentar actualizar el producto con el ID ${pid}`);
  }
});

// Ruta para eliminar un producto por su ID ("/:pid")
productsRouter.delete("/:pid", async (req, res) => {
  const { pid } = req.params;
  try {
    // Eliminar el producto utilizando productManager
    await productManager.deleteProduct(pid);
    // Enviar un mensaje de éxito como respuesta
    res.send("Producto eliminado con éxito");
  } catch (error) {
    // Manejar cualquier error que ocurra durante la eliminación de un producto por ID
    console.log(error);
    res.send(`ERROR al intentar eliminar el producto con el ID ${pid}`);
  }
});

// Exportar el router para su uso en otros archivos
export { productsRouter };
