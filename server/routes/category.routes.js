import express from "express";
import { addCategory, getCategories } from "../controller/categoryController.js";

const router = express.Router();

router.post("/add", addCategory);
router.get("/list", getCategories);

export default router;
