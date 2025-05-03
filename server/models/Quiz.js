import mongoose from "mongoose";

export const QUIZ_CATEGORIES = [
  'javascript',
  'python', 
  'java',
  'algorithms',
  'data_structures',
  'web_development',
  'database',
  'system_design'
];

export const DIFFICULTY_LEVELS = ['easy', 'medium', 'hard'];

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
    enum: QUIZ_CATEGORIES,
    required: true,
  },
  difficulty: {
    type: String,
    enum: DIFFICULTY_LEVELS,
    required: true,
  },
  explanation: {
    type: String,
    required: true,
  },
  points: {
    type: Number,
    default: function() {
      switch(this.difficulty) {
        case 'easy': return 10;
        case 'medium': return 20;
        case 'hard': return 30;
        default: return 10;
      }
    }
  }
}, { timestamps: true });

const Quiz = mongoose.model("Quiz", quizSchema);

export default Quiz;
