import { Schema, model } from 'mongoose'
import { randomUUID } from 'crypto'

const collection = 'products'

// Define el esquema de los productos
const productSchema = new Schema(
    {
        _id: {
            type: String,
            default: randomUUID(),
            required: true,
            unique: true,
        },
        title: { type: String, required: true, unique: true },
        description: { type: String, required: true },
        code: { type: String, required: true, unique: true },
        price: { type: Number, required: true },
        status: { type: Boolean, default: true },
        stock: { type: Number, required: true, min: 0 },
        category: { type: String, required: true },
        photoUrl: { type: String, default: 'static/imgs/fotoGenerica.png' },
    },
    {
        strict: 'throw',
        versionKey: false,
    }
)

export const ProductModel = model(collection, productSchema)

// import { Schema, model } from "mongoose";
// import { randomUUID } from "crypto";
// import mongoosePaginate from "mongoose-paginate-v2";

// const collection = "products";

// // Define el esquema de los productos
// const productSchema = new Schema(
//   {
//     _id: { type: String, default: randomUUID(), required: true, unique: true },
//     title: { type: String, required: true, unique: true },
//     description: { type: String, required: true },
//     code: { type: String, required: true, unique: true },
//     price: { type: Number, required: true },
//     status: { type: Boolean, default: true },
//     stock: { type: Number, required: true },
//     category: { type: String, required: true },
//     photoUrl: { type: String, default: "static/imgs/fotoGenerica.png" },
//   },
//   {
//     strict: "throw",
//     versionKey: false,
//     methods: {},
//     statics: {
//       getProducts: async function (page, limit, search, sort, category) {
//         try {
//           const categoryOptions = [
//             "Panadería",
//             "Pastelería",
//             "Postres",
//             "Repostería",
//             "Heladería",
//             "Bebidas",
//           ];

//           category === "All"
//             ? (category = [...categoryOptions])
//             : (category = category.split(","));

//           sort ? (sort = sort.split(",")) : (sort = ["Price"]);

//           let sortBy = {};
//           if (sort[1]) {
//             sortBy[sort[0]] = sort[1];
//           } else {
//             sort[0] === "price"
//               ? (sortBy[sort[0]] = "asc")
//               : (sortBy[sort[0]] = "asc");
//           }

//           const products = await this.find({
//             title: { $regex: search, $options: "i" },
//             category: { $in: category },
//           })
//             .sort(sortBy)
//             .skip(page * limit)
//             .limit(limit);

//           const total = await this.countDocuments({
//             category: { $in: [...category] },
//             title: { $regex: search, $options: "i" },
//           });

//           const response = {
//             error: false,
//             total,
//             page: page + 1,
//             limit,
//             category: categoryOptions,
//             products,
//           };

//           return response;
//         } catch (error) {
//           throw new Error(`Error al obtener los productos: ${error.message}`);
//         }
//       },
//       getCategories: async function () {
//         try {
//           const categories = await this.distinct("category").exec();
//           return categories;
//         } catch (error) {
//           throw new Error(`Error al obtener las categorías: ${error.message}`);
//         }
//       },
//       getAllProducts: async function () {
//         try {
//           const products = await this.find().lean();
//           return products;
//         } catch (error) {
//           throw new Error(
//             `Error al obtener todos los productos: ${error.message}`
//           );
//         }
//       },
//       getProductById: async function (productId) {
//         try {
//           const product = await this.findById(productId);
//           return product;
//         } catch (error) {
//           throw new Error(
//             `Error al obtener el producto por ID: ${error.message}`
//           );
//         }
//       },
//       createProduct: async function (productData) {
//         try {
//           const createdProduct = await this.create(productData);
//           return createdProduct;
//         } catch (error) {
//           throw new Error(`Error al crear el producto: ${error.message}`);
//         }
//       },
//       modifyProductById: async function (productId, updatedData) {
//         try {
//           const modifiedProduct = await this.findByIdAndUpdate(
//             productId,
//             { $set: updatedData },
//             { new: true }
//           );
//           return modifiedProduct;
//         } catch (error) {
//           throw new Error(`Error al modificar el producto: ${error.message}`);
//         }
//       },
//       removeProductById: async function (productId) {
//         try {
//           const deletedProduct = await this.findByIdAndDelete(productId);
//           return deletedProduct;
//         } catch (error) {
//           throw new Error(`Error al eliminar el producto: ${error.message}`);
//         }
//       },
//       changeProductPhoto: async function (productId, newPhotoPath) {
//         try {
//           const modifiedProduct = await this.findByIdAndUpdate(
//             productId,
//             { $set: { photoUrl: newPhotoPath } },
//             { new: true }
//           );
//           return modifiedProduct;
//         } catch (error) {
//           throw new Error(
//             `Error al cambiar la foto del producto: ${error.message}`
//           );
//         }
//       },
//       getPaginatedProducts: async function (
//         page,
//         limit,
//         search,
//         sortField,
//         sortOrder,
//         category
//       ) {
//         try {
//           const categoryOptions = [
//             "Panadería",
//             "Pastelería",
//             "Postres",
//             "Repostería",
//             "Heladería",
//             "Bebidas",
//           ];

//           category =
//             category === "All"
//               ? [...categoryOptions]
//               : typeof category === "string"
//               ? category.split(",")
//               : categoryOptions;

//           const validSortFields = ["price", "status", "stock"];
//           if (!validSortFields.includes(sortField)) {
//             sortField = "price";
//           }

//           const sortBy = {};
//           sortBy[sortField] = sortOrder === "desc" ? -1 : 1;

//           const query = {
//             title: { $regex: search, $options: "i" },
//             category: { $in: category },
//           };

//           const products = await this.find(query)
//             .sort(sortBy)
//             .skip((page - 1) * limit)
//             .limit(limit)
//             .lean();

//           const total = await this.countDocuments(query);

//           const totalPages = Math.ceil(total / limit);
//           const hasPrevPage = page > 1;
//           const hasNextPage = page < totalPages;
//           const prevPage = hasPrevPage ? page - 1 : null;
//           const nextPage = hasNextPage ? page + 1 : null;
//           const pages = [];
//           for (let i = 1; i <= totalPages; i++) {
//             pages.push({
//               number: i,
//               link: `/products?page=${i}&limit=${limit}&search=${search}&category=${category.join(
//                 ","
//               )}&sort=${sortField}&order=${sortOrder}`,
//               isActive: i === page,
//             });
//           }

//           return {
//             products,
//             total,
//             totalPages,
//             hasPrevPage,
//             hasNextPage,
//             prevPage,
//             nextPage,
//             pages,
//           };
//         } catch (error) {
//           throw new Error(
//             `Error al obtener los productos paginados: ${error.message}`
//           );
//         }
//       },
//     },
//   }
// );

// productSchema.plugin(mongoosePaginate);

// // Define el modelo de productos y se exporta
// export const ProductModel = model(collection, productSchema);
