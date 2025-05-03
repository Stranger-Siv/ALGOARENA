import express from "express";
import {
  getQuizzes,
  getQuizById,
  createQuiz,
  deleteQuiz,
  updateQuiz,
  getQuizOptions
} from "../controllers/quizController.js";
import { verifyToken } from "../middlewares/auth.js";
import { isAdmin } from "../middlewares/adminAuth.js";

const router = express.Router();

router.get("/options", getQuizOptions);  
router.get("/", getQuizzes);            
router.get("/:id", getQuizById);       

router.post("/", verifyToken, isAdmin, createQuiz);
router.delete("/:id", verifyToken, isAdmin, deleteQuiz);
router.put("/:id", verifyToken, isAdmin, updateQuiz);

const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: "Something went wrong!", 
    error: process.env.NODE_ENV === 'development' ? err.message : undefined 
  });
};

router.use(errorHandler);

export default router;
