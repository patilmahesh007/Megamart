import express from "express";
import { getCart, addToCart, removeFromCart ,updateCart} from "../controller/cart.controller.js";

const cartRouter = express.Router();

cartRouter.get("/get", getCart);
cartRouter.post("/add", addToCart);
cartRouter.delete("/remove", removeFromCart);
cartRouter.put("/update", updateCart);

export default cartRouter;
