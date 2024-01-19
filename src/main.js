import express from "express";
import bodyParser from "body-parser";
import { connect } from "mongoose";
import { CNX_STR, PORT } from "./config.js";
import { apiRouter } from "./routers/api/api.router.js";
import { webRouter } from "./routers/web/web.router.js";
import { engine } from "express-handlebars";
import { sessions } from "./middlewares/sessions.js";
import { authentication } from "./middlewares/passport.js";
import { attachUser } from "./middlewares/auth.js";
import { errorHandler } from "./middlewares/errorHandler.js";

// Conexión a la Base de Datos
try {
  await connect(CNX_STR);
  console.log(`Base de datos conectada a ${CNX_STR}`);
} catch (error) {
  console.error("Error de conexión a la base de datos:", error.message);
  process.exit(1);
}

export const app = express();

// Configuración del motor de vistas y directorio de vistas
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./views");

// Configuración de middleware para manejar archivos estáticos
app.use("/static", express.static("./static"));

// Configuración de middleware para analizar el cuerpo de la solicitud
app.use(bodyParser.urlencoded({ extended: true }));

// Configuración de middleware de sesiones
app.use(sessions);
app.use(authentication);
app.use(attachUser);

// Configuración de middleware para las rutas de la API
app.use("/api", apiRouter);
app.use("/", webRouter);

// Exponer la función isCartEmpty al entorno de Handlebars
app.locals.isCartEmpty = function (cartItems) {
  return cartItems.length === 0;
};

// Exponer la función isAdmin al entorno de Handlebars
app.locals.isAdmin = function (registeredUser) {
  return registeredUser.rol === "admin";
};

// Middleware de manejo de errores global
app.use(errorHandler);

// Inicio del servidor Express en el puerto especificado
const server = app.listen(PORT, () => {
  console.log(
    `Servidor conectado en el puerto ${PORT} - ${new Date().toLocaleString()}`
  );
});
