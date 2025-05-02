// models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  score: {
    type: Number,
    default: 0,
  },
  streak: {
    type: Number,
    default: 0,
  },
  milestones: [{
    type: Number,
  }],
  quizHistory: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "QuizAttempt"
  }]
}, { timestamps: true });

export default mongoose.model("User", userSchema);
