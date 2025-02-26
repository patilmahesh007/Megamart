import express from "express";
import upload from "../utils/upload.js";
import { uploadPhotoController } from "../controller/uploadController.js";

const router = express.Router();

router.post("/img", upload.single("file"), uploadPhotoController);

export default router;
