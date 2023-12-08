import express from "express";
import { connect } from "mongoose";
import { MONGODB_CNX_STR, PORT } from "./config.js";
import { apiRouter } from "./routers/api.router.js";
import { webRouter } from "./routers/web.router.js";
import { engine } from "express-handlebars";

// Conexión a la Base de Datos
try {
  await connect(MONGODB_CNX_STR);
  console.log("Base de datos conectada");
} catch (error) {
  console.error("Error de conexión a la base de datos:", error.message);
  process.exit(1);
}

const app = express();

app.use(express.json());

// Configuración del motor de vistas y directorio de vistas
app.engine("handlebars", engine());
app.set("views", "./views");
app.set("view engine", "handlebars");

// Configuración de middleware para manejar archivos estáticos
app.use("/static", express.static("./static"));

// Configuración de middleware para las rutas de la API
app.use("/api", apiRouter);
app.use("/", webRouter);

// Inicio del servidor Express en el puerto especificado
const server = app.listen(PORT, () => {
  console.log(
    `Servidor conectado en el puerto ${PORT} - ${new Date().toLocaleString()}`
  );
});
