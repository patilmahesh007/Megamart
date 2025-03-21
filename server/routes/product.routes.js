import express from "express";
import {
  addProduct,
  getProductById,
  updateProduct,
  deleteProduct,
  listProducts,
  listProductsByCategory
} from "./../controller/product.controller.js";
import upload from "../utils/upload.js"; 

const productRouter = express.Router();

productRouter.post(
  "/",
  upload.fields([
    { name: "mainImage", maxCount: 1 },
    { name: "images", maxCount: 5 }
  ]),
  addProduct
);

productRouter.get("/", listProducts);

productRouter.get("/get/:id", getProductById);

productRouter.put(
  "/update/:id",
  upload.fields([
    { name: "mainImage", maxCount: 1 },
    { name: "images", maxCount: 10 }
  ]),
  updateProduct
);

productRouter.delete("/:id", deleteProduct);

productRouter.get("/category/:id", listProductsByCategory);

export default productRouter;
