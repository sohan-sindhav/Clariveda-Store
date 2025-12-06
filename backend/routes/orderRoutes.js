// routes/orderRoutes.js
import express from "express";
import {
  createOrder,
  getUserOrders,
  getOrderById,
} from "../controllers/orderController.js";
import { verifyUser } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/check-cookie", verifyUser, (req, res) => {
  res.json({ success: true, user: req.user });
});

router.post("/create", verifyUser, createOrder);
router.get("/my-orders", verifyUser, getUserOrders);
router.get("/:id", verifyUser, getOrderById);

export default router;
