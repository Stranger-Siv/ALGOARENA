import mongoose from "mongoose";

const quizAttemptSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  quiz: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Quiz",
    required: true
  },
  score: {
    type: Number,
    required: true
  },
  timeSpent: {
    type: Number,
    required: true
  },
  correctAnswers: {
    type: Number,
    required: true
  },
  totalQuestions: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  completedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

quizAttemptSchema.index({ score: -1, timeSpent: 1 });
quizAttemptSchema.index({ user: 1, completedAt: -1 });

export default mongoose.model("QuizAttempt", quizAttemptSchema);
