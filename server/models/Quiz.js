import mongoose from "mongoose";

const quizSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  options: [
    {
      text: {
        type: String,
        required: true,
      },
      isCorrect: {
        type: Boolean,
        required: true,
      },
    },
  ],
  category: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    required: true,
  },
  explanation: {
    type: String,
    required: true,
  },
});

const Quiz = mongoose.model("Quiz", quizSchema);

export default Quiz;
