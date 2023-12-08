import express from "express";
import { connect } from "mongoose";
import { MONGODB_CNX_STR, PORT } from "./config.js";
import { apiRouter } from "./routers/api.router.js";

await connect(MONGODB_CNX_STR);
console.log("base de datos conectada");

const app = express();

// Inicio del servidor Express en el puerto especificado
const server = app.listen(PORT, () => {
  console.log(`Servidor conectado en el puerto ${PORT}`);
});

app.use("/static", express.static("./static"));

app.use("/api", apiRouter);

// // Importación de módulos y dependencias necesarias
// import express from "express";
// import { engine } from "express-handlebars";
// import { Server as IOServer } from "socket.io";
// //import { ProductManager } from "./services/ProductManager.js";
// import { CartManager } from "./services/cartManager.js";
// import { ProductManagerMongoDb } from "./services/ProductManagerMongoDb.js";
// import { mongoose } from "mongoose";
// import { MONGODB_CNX_STR, PORT } from "./config.js";
// import { apiProductsRouter } from "./routers/api.products.router.js";
// import { apiCartsRouter } from "./routers/api.carts.router.js";
// import { webRouter } from "./routers/web.router.js";

// // Creación de instancias para gestionar productos y carritos
// //export const productManager = new ProductManager();
// export const productManager = new ProductManagerMongoDb();
// export const cartManager = new CartManager();

// await mongoose.connect(MONGODB_CNX_STR);
// console.log(`Base de datos conectada a ${MONGODB_CNX_STR}`);

// // Creación de una instancia de Express
// const app = express();

// // Inicio del servidor Express en el puerto especificado
// const server = app.listen(PORT, () => {
//   console.log(`Servidor conectado en el puerto ${PORT}`);
// });

// // Configuración del motor de vistas y directorio de vistas
// app.engine("handlebars", engine());
// app.set("views", "./views");
// app.set("view engine", "handlebars");

// // Configuración para servir contenido estático desde la ruta "/static"
// app.use("/static", express.static("./static"));

// // Middleware para el manejo de datos en formato JSON
// app.use(express.json());

// // Configuración de rutas para la API y el enrutador web
// app.use("/api/products", apiProductsRouter); // Ruta para la API de productos (http://localhost:8080/api/products)
// app.use("/api/carts", apiCartsRouter); // Ruta para la API de carritos
// app.use("/", webRouter); // Ruta para el enrutador web

// // Creación de una instancia de Socket.IO asociada al servidor Express
// const ioServer = new IOServer(server);

// // Manejo de eventos de conexión con Socket.IO
// ioServer.on("connection", async (socket) => {
//   console.log("Nueva conexión: ", socket.id);

//   // Emitir una actualización con la lista de productos al nuevo cliente
//   socket.emit("actualizacion", { productos: await productManager.getAll() });

//   // Manejar el evento "agregarProducto" enviado por el cliente
//   socket.on("agregarProducto", async (producto, callback) => {
//     // Agregar el producto y obtener una respuesta
//     const respuesta = await productManager.addProduct(producto);

//     // Llamar a la función de retorno (callback) con la respuesta
//     callback({ status: respuesta });

//     // Emitir una actualización con la lista de productos a todos los clientes conectados
//     socket.emit("actualizacion", { productos: await productManager.getAll() });
//   });
// });
