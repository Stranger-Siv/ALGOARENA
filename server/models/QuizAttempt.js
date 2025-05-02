import mongoose from "mongoose";

const quizAttemptSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  quizzes: [{
    quizId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz"
    },
    selectedOption: String,
    isCorrect: Boolean
  }],
  totalQuestions: Number,
  correctAnswers: Number,
  score: Number,
  timeTakenInSeconds: Number,
  playedAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("QuizAttempt", quizAttemptSchema);
