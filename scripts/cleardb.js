import mongoose from "mongoose";

await mongoose.connect("mongodb://127.0.0.1:27017/coderhouse");
console.log("connected!");
await mongoose.connection.dropDatabase();
console.log("dropped!");
await mongoose.disconnect();
console.log("disconnected");
