// Importación de módulos y dependencias necesarias
import express from "express";
import { engine } from "express-handlebars";
import { Server as IOServer } from "socket.io";
import { ProductManager } from "./services/ProductManager.js";
import { CartManager } from "./services/cartManager.js";
import { productsRouter } from "./routes/products.router.js";
import { cartsRouter } from "./routes/carts.router.js";
import { webRouter } from "./routes/web.router.js";

// Definición del puerto en el que se ejecutará el servidor
const PORT = 8080;

// Creación de instancias para gestionar productos y carritos
export const productManager = new ProductManager();
export const cartManager = new CartManager();

// Creación de una instancia de Express
const app = express();

// Configuración del motor de vistas y directorio de vistas
app.engine("handlebars", engine());
app.set("views", "./views");
app.set("view engine", "handlebars");

// Configuración para servir contenido estático desde la ruta "/static"
app.use("/static", express.static("./static"));

// Middleware para el manejo de datos en formato JSON
app.use(express.json());

// Configuración de rutas para la API y el enrutador web
app.use("/api/products", productsRouter); // Ruta para la API de productos (http://localhost:8080/api/products)
app.use("/api/carts", cartsRouter); // Ruta para la API de carritos
app.use("/", webRouter); // Ruta para el enrutador web

// Inicio del servidor Express en el puerto especificado
const server = app.listen(PORT, () => {
  console.log(`Servidor conectado en el puerto ${PORT}`);
});

// Creación de una instancia de Socket.IO asociada al servidor Express
const ioServer = new IOServer(server);

// Manejo de eventos de conexión con Socket.IO
ioServer.on("connection", async (socket) => {
  console.log("Nueva conexión: ", socket.id);

  // Emitir una actualización con la lista de productos al nuevo cliente
  socket.emit("actualizacion", { productos: await productManager.getAll() });

  // Manejar el evento "agregarProducto" enviado por el cliente
  socket.on("agregarProducto", async (producto, callback) => {
    // Agregar el producto y obtener una respuesta
    const respuesta = await productManager.addProduct(producto);

    // Llamar a la función de retorno (callback) con la respuesta
    callback({ status: respuesta });

    // Emitir una actualización con la lista de productos a todos los clientes conectados
    socket.emit("actualizacion", { productos: await productManager.getAll() });
  });
});
