import express from "express";
import {
  getQuizzes,
  getQuizById,
  createQuiz,
  deleteQuiz,
  updateQuiz
} from "../controllers/quizController.js";

const router = express.Router();

router.get("/", getQuizzes);

router.get("/:id", getQuizById);

router.post("/", createQuiz);

router.delete("/:id", deleteQuiz);

router.put("/:id", updateQuiz);

export default router;
