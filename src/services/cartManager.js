// // Importación de módulos y dependencias necesarias
// import { promises as fs } from "fs";
// import { v4 as uuidv4 } from "uuid";

// // Definición de la clase CartManager
// export class CartManager {
//   constructor() {
//     // Ruta del archivo JSON que almacenará los carritos
//     this.path = "./cart.json";
//     // Lista de carritos, inicialmente vacía
//     this.cart = [];
//   }

//   // Método para obtener todos los carritos
//   getCarts = async () => {
//     // Leer el archivo JSON y convertir su contenido a formato JSON
//     const response = await fs.readFile(this.path, "utf-8");
//     const responseJSON = JSON.parse(response);
//     // Devolver la lista de carritos
//     return responseJSON;
//   };

//   // Método para obtener los productos de un carrito por su ID
//   getCartProducts = async (id) => {
//     // Obtener la lista completa de carritos
//     const carts = await this.getCarts();
//     // Buscar el carrito con el ID proporcionado
//     const cart = carts.find((cart) => cart.id === id);
//     // Devolver los productos del carrito si se encuentra, de lo contrario, imprimir un mensaje
//     if (cart) {
//       return cart.products;
//     } else {
//       console.log("Carrito no encontrado");
//     }
//   };

//   // Método para crear un nuevo carrito
//   newCart = async () => {
//     // Generar un nuevo ID único para el carrito
//     const id = uuidv4();
//     // Crear un nuevo objeto de carrito con una lista vacía de productos
//     const newCart = { id, products: [] };
//     // Obtener la lista actual de carritos desde el archivo
//     this.cart = await this.getCarts();
//     // Agregar el nuevo carrito a la lista
//     this.cart.push(newCart);
//     // Escribir la lista actualizada de carritos en el archivo JSON
//     await fs.writeFile(this.path, JSON.stringify(this.cart));
//     // Devolver el nuevo carrito creado
//     return newCart;
//   };

//   // Método para agregar un producto a un carrito
//   addProductToCart = async (cart_id, product_id) => {
//     // Obtener la lista actual de carritos
//     const carts = await this.getCarts();
//     // Encontrar el índice del carrito al que se agregará el producto
//     const index = carts.findIndex((cart) => cart.id === cart_id);
//     // Verificar si se encontró el carrito
//     if (index !== -1) {
//       // Obtener la lista de productos actual del carrito
//       const cartProducts = await this.getCartProducts(cart_id);
//       // Encontrar el índice del producto en la lista de productos del carrito
//       const existingProductIndex = cartProducts.findIndex(
//         (product) => product.product_id === product_id
//       );
//       // Verificar si el producto ya está en el carrito
//       if (existingProductIndex !== -1) {
//         // Incrementar la cantidad si el producto ya está en el carrito
//         cartProducts[existingProductIndex].quantity =
//           cartProducts[existingProductIndex].quantity + 1;
//       } else {
//         // Agregar el producto al carrito con una cantidad de 1 si no está en el carrito
//         cartProducts.push({ product_id, quantity: 1 });
//       }

//       // Actualizar la lista de productos del carrito en la lista de carritos
//       carts[index].products = cartProducts;

//       // Escribir la lista actualizada de carritos en el archivo JSON
//       await fs.writeFile(this.path, JSON.stringify(carts));
//       console.log("Producto agregado con éxito");
//     } else {
//       console.log("Carrito no encontrado");
//     }
//   };
// }
