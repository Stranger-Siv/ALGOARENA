import express from "express";
import { registerUser, loginUser, updateUserProfile, getUserProfile, getUserQuizHistory  } from "../controllers/userController.js";
import { verifyToken } from "../middlewares/auth.js";

const router = express.Router();
console.log("userRoutes loaded");

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/profile", verifyToken, getUserProfile);

router.put("/profile", verifyToken, updateUserProfile);

router.get("/quiz-history", verifyToken, getUserQuizHistory);

export default router;