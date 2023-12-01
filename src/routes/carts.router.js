import { Router } from "express";
import { cartManager } from "../index.js";

// Creación de una instancia de Router para manejar las rutas relacionadas con los carritos
const cartsRouter = Router();

// Ruta para crear un nuevo carrito ("/")
cartsRouter.post("/", async (req, res) => {
  try {
    // Crear un nuevo carrito utilizando cartManager
    const response = await cartManager.newCart();
    // Enviar la respuesta como JSON
    res.json(response);
  } catch (error) {
    // Manejar cualquier error que ocurra durante la creación del carrito
    res.send("ERROR al crear el carrito");
  }
});

// Ruta para obtener los productos de un carrito por su ID ("/:cid")
cartsRouter.get("/:cid", async (req, res) => {
  const { cid } = req.params;
  try {
    // Obtener los productos de un carrito utilizando cartManager
    const response = await cartManager.getCartProducts(cid);
    // Enviar la respuesta como JSON
    res.json(response);
  } catch (error) {
    // Manejar cualquier error que ocurra durante la obtención de productos del carrito
    res.send("ERROR al intentar enviar los productos del carrito");
  }
});

// Ruta para agregar un producto a un carrito ("/:cid/products/:pid")
cartsRouter.post("/:cid/products/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  try {
    // Agregar un producto a un carrito utilizando cartManager
    await cartManager.addProductToCart(cid, pid);
    // Enviar un mensaje de éxito como respuesta
    res.send("Producto agregado exitosamente");
  } catch (error) {
    // Manejar cualquier error que ocurra durante la adición de productos al carrito
    res.send("ERROR al intentar guardar productos en el escritorio");
  }
});

// Exportar el router para su uso en otros archivos
export { cartsRouter };
