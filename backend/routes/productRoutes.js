import express from "express";
import upload from "../middleware/multer.js";
import {
  createProduct,
  getAllProducts,
  deleteProduct,
} from "../controllers/productController.js";
import { verifyAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create", verifyAdmin, upload.single("image"), createProduct);
router.get("/all", getAllProducts);
router.delete("/:id", verifyAdmin, deleteProduct);

export default router;
