import express from "express";
import {
  createOrder,
  getUserOrders,
  getOrderById,
  getAllOrdersAdmin,
  updateOrderStatusAdmin,
} from "../controllers/orderController.js";
import { verifyUser, verifyAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/check-cookie", verifyUser, (req, res) => {
  res.json({ success: true, user: req.user });
});

router.get("/admin/all", verifyAdmin, getAllOrdersAdmin);
router.put("/admin/:id/status", verifyAdmin, updateOrderStatusAdmin);

router.post("/create", verifyUser, createOrder);
router.get("/my-orders", verifyUser, getUserOrders);
router.get("/:id", verifyUser, getOrderById);

export default router;
