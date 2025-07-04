import express from "express";
const router = express.Router();

import {
  register,
  login,
  logout,
  sendVerifyOTP,
  verifyAccount,
  forgotPassword,
  resetPassword,
} from "../controllers/auth.controller.js";
import { isAuthenticated } from "../middleware/auth.middleware.js";

//Register User
router.post("/register", register);

//Login User
router.post("/login", login);

//Logout User
router.get("/logout", isAuthenticated, logout);

router.get("/send-verify-otp", isAuthenticated, sendVerifyOTP);

router.post("/verify-account", isAuthenticated, verifyAccount);

router.post("/forgot-password", forgotPassword);

router.post("/reset-password", resetPassword);

export default router;
