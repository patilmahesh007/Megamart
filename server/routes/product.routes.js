import express from "express";
import {
  addProduct,
  getProductById,
  updateProduct,
  deleteProduct,
  listProducts,
} from "./../controller/product.controller.js";

const productRouter = express.Router();

productRouter.post("/add", addProduct);
productRouter.get("/list", listProducts);
productRouter.get("/get/:id", getProductById);
productRouter.put("/update/:id", updateProduct);
productRouter.delete("/delete/:id", deleteProduct);

export default productRouter;
