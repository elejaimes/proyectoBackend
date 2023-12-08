// // Importar módulos necesarios
// import { promises as fs } from "fs";
// import { v4 as uuidv4 } from "uuid";

// // Definir la clase Products
// export class Products {
//   // Constructor de la clase Products
//   constructor(path) {
//     // Asignar la ruta del archivo JSON proporcionada o usar un valor predeterminado
//     this.path = path || "./products.json";
//   }

//   // Método para crear un nuevo objeto de producto
//   con({ title, description, code, price, status, stock, category, thumbnail }) {
//     // Generar un nuevo ID único utilizando la biblioteca uuid
//     const id = uuidv4();
//     // Devolver un nuevo objeto de producto con las propiedades proporcionadas
//     return {
//       id,
//       title,
//       description,
//       code,
//       price,
//       status,
//       stock,
//       category,
//       thumbnail,
//     };
//   }

//   // Método para obtener la lista de productos desde el archivo JSON
//   async getProducts() {
//     try {
//       // Leer el contenido del archivo en formato JSON
//       const response = await fs.readFile(this.path, "utf-8");
//       // Convertir el contenido a un objeto JSON
//       const responseJSON = JSON.parse(response);
//       // Devolver la lista de productos
//       return responseJSON;
//     } catch (error) {
//       // Manejar errores en la lectura del archivo
//       console.error("Error reading products file:", error);
//       // Devolver una lista vacía en caso de error
//       return [];
//     }
//   }

//   // Método para convertir la lista de productos a un formato de objeto JSON
//   toPOJO(productList) {
//     // Mapear cada producto en la lista a un nuevo objeto con propiedades específicas
//     return productList.map(
//       ({
//         id,
//         title,
//         description,
//         code,
//         price,
//         status,
//         stock,
//         category,
//         thumbnail,
//       }) => ({
//         id,
//         title,
//         description,
//         code,
//         price,
//         status,
//         stock,
//         category,
//         thumbnail,
//       })
//     );
//   }
// }
