// routes/paymentRoutes.js
import express from "express";
import { verifyPayment } from "../controllers/paymentController.js";
import { verifyUser } from "../middleware/authMiddleware.js";

const router = express.Router();
router.post("/verify", verifyUser, verifyPayment);
export default router;
