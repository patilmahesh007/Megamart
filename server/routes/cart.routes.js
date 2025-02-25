import express from "express";
import { getCart, addToCart, removeFromCart } from "../controller/cart.controller.js";

const cartRouter = express.Router();

cartRouter.get("/get/:userId", getCart);
cartRouter.post("/add", addToCart);
cartRouter.delete("/remove", removeFromCart);

export default cartRouter;
