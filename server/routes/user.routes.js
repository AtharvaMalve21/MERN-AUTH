import express from "express";

const router = express.Router();

import { getUserProfile } from "../controllers/user.controller.js";

import { isAuthenticated } from "../middleware/auth.middleware.js";

router.get("/profile", isAuthenticated, getUserProfile);

export default router;
