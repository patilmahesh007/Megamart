import express from "express";
import { addCategory, getCategories } from "../controller/category.Controller.js";

const router = express.Router();

router.post("/add", addCategory);
router.get("/list", getCategories);

export default router;
