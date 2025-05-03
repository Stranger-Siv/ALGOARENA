import Quiz, { QUIZ_CATEGORIES, DIFFICULTY_LEVELS } from "../models/Quiz.js";

export const getQuizOptions = async (req, res) => {
  try {
    const categoryStats = await Quiz.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
          difficulties: {
            $addToSet: "$difficulty"
          }
        }
      }
    ]);

    const categories = QUIZ_CATEGORIES.map(category => {
      const stats = categoryStats.find(stat => stat._id === category) || { count: 0, difficulties: [] };
      return {
        name: category,
        quizCount: stats.count,
        availableDifficulties: stats.difficulties
      };
    });

    res.status(200).json({
      categories,
      difficulties: DIFFICULTY_LEVELS
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching quiz options", error });
  }
};

export const getQuizzes = async (req, res) => {
  try {
    const { category, difficulty } = req.query;

    const query = {};
    if (category) query.category = category;
    if (difficulty) query.difficulty = difficulty;

    const quizzes = await Quiz.find(query).select('-options.isCorrect');
    res.status(200).json(quizzes);
  } catch (error) {
    res.status(500).json({ message: "Error fetching quizzes", error });
  }
};

export const getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    res.status(200).json(quiz);
  } catch (error) {
    res.status(500).json({ message: "Error fetching quiz", error });
  }
};

export const createQuiz = async (req, res) => {
  try {
    const { question, options, category, difficulty, explanation } = req.body;

    const newQuiz = new Quiz({
      question,
      options,
      category,
      difficulty,
      explanation
    });

    await newQuiz.save();
    res.status(201).json({ message: "Quiz created", quiz: newQuiz });
  } catch (error) {
    res.status(500).json({ message: "Error creating quiz", error });
  }
};

export const deleteQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findByIdAndDelete(req.params.id);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    res.status(200).json({ message: "Quiz deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting quiz", error });
  }
};

export const updateQuiz = async (req, res) => {
  try {
    const updatedQuiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!updatedQuiz) return res.status(404).json({ message: "Quiz not found" });

    res.status(200).json({ message: "Quiz updated", quiz: updatedQuiz });
  } catch (error) {
    res.status(500).json({ message: "Error updating quiz", error });
  }
};
