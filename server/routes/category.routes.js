import express from "express";
import { addCategory, getCategories } from "../controller/category.Controller.js";
import upload from "../utils/upload.js";

const router = express.Router();

router.post("/add", upload.fields([
    { name: "categoryImg", maxCount: 1 },
]),  addCategory);
router.get("/list", getCategories);

export default router;  
