import express from "express";
import { engine } from "express-handlebars";
import { Server as IOServer } from "socket.io";
import { ProductManager } from "./ProductManager.js";
import { CartManager } from "./cartManager.js";
import { productsRouter } from "./routes/products.router.js";
import { cartsRouter } from "./routes/carts.router.js";
import { webRouter } from "./routes/web.router.js";

const PORT = 8080;
const app = express();

export const productManager = new ProductManager();
export const cartManager = new CartManager();

app.engine("handlebars", engine());
app.set("views", "./views");
app.set("view engine", "handlebars");

app.use("/static", express.static("./static")); // Para ver contenido estático

app.use(express.json());
app.use("/api/products", productsRouter); // http://localhost:8080/api/products
app.use("/api/carts", cartsRouter);
app.use("/", webRouter);

const server = app.listen(PORT, () => {
  console.log(`Servidor conectado en el puerto ${PORT}`);
});

const ioServer = new IOServer(server);

ioServer.on("connection", async (socket) => {
  console.log("Nueva conexión: ", socket.id);
  socket.emit("actualizacion", { productos: await productManager.getAll() });
  socket.on("agregarProducto", async (producto, callback) => {
    const respuesta = await productManager.addProduct(producto);
    callback({ status: respuesta });
    socket.emit("actualizacion", { productos: await productManager.getAll() });
  });
});
