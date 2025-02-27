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
  "/add",
  upload.fields([
    { name: "mainImage", maxCount: 1 },
    { name: "images", maxCount: 5 }
  ]),
  addProduct
);

productRouter.get("/list", listProducts);
productRouter.get("/get/:id", getProductById);
productRouter.put("/update/:id", updateProduct);
productRouter.delete("/delete/:id", deleteProduct);
productRouter.get("/list/category/:id", listProductsByCategory);

export default productRouter;
