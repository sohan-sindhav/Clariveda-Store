import express from "express";
const router = express.Router();
import {
  getProfile,
  LoginController,
  Logout,
  RegisterController,
} from "../controllers/authController.js";
import { verifyUser } from "../middleware/authMiddleware.js";

router.post("/register", RegisterController);
router.post("/login", LoginController);
router.post("/Logout", Logout);
router.get("/profile", verifyUser, getProfile);

export default router;
