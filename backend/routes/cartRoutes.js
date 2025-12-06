import express from "express";
import {
  addToCart,
  getCart,
  removeFromCart,
  clearCart,
  syncCart,
} from "../controllers/cartController.js";
import { verifyUser } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/add", verifyUser, addToCart);
router.get("/", verifyUser, getCart);
router.delete("/:productId", verifyUser, removeFromCart);
router.delete("/clear", verifyUser, clearCart);
router.post("/sync", verifyUser, syncCart);

export default router;
