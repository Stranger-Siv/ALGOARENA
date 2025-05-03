import express from "express";
import { saveQuizAttempt, getQuizHistory, getLeaderboard } from "../controllers/quizAttemptController.js";
import { verifyToken } from "../middlewares/auth.js";

const router = express.Router();

router.post("/", verifyToken, saveQuizAttempt);
router.get("/history", verifyToken, getQuizHistory);

router.get("/leaderboard", getLeaderboard);

export default router; 