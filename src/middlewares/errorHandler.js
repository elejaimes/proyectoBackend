export function errorHandler(err, req, res, next) {
  console.error(err);

  // Verifica si es un error de validación de Mongoose
  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((error) => error.message);
    return res.status(400).json({ status: "error", errors });
  }

  // Puedes agregar más lógica de manejo de errores aquí según tus necesidades

  // Error genérico de servidor
  res.status(500).json({ status: "error", message: "Internal Server Error" });
}
