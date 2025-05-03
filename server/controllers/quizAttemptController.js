import QuizAttempt from "../models/QuizAttempt.js";
import User from "../models/User.js";

export const saveQuizAttempt = async (req, res) => {
    try {
        const { quizId, score, timeSpent, correctAnswers, totalQuestions, category } = req.body;
        
        const attempt = new QuizAttempt({
            user: req.user.userId,
            quiz: quizId,
            score,
            timeSpent,
            correctAnswers,
            totalQuestions,
            category
        });

        await attempt.save();

        const user = await User.findById(req.user.userId);
        user.score += score;
        
        const lastAttempt = await QuizAttempt.findOne({ 
            user: req.user.userId 
        }).sort({ completedAt: -1 });

        if (lastAttempt) {
            const hoursSinceLastAttempt = (Date.now() - lastAttempt.completedAt) / (1000 * 60 * 60);
            if (hoursSinceLastAttempt <= 24) {
                user.streak += 1;
            } else {
                user.streak = 1;
            }
        } else {
            user.streak = 1;
        }

        const milestones = [100, 500, 1000, 5000, 10000];
        const newMilestone = milestones.find(m => 
            user.score >= m && !user.milestones.includes(m)
        );
        if (newMilestone) {
            user.milestones.push(newMilestone);
        }

        await user.save();

        res.status(201).json({
            message: "Quiz attempt saved successfully",
            attempt,
            userUpdates: {
                newScore: user.score,
                currentStreak: user.streak,
                newMilestone
            }
        });
    } catch (error) {
        console.error("Error saving quiz attempt:", error);
        res.status(500).json({ message: "Error saving quiz attempt" });
    }
};

export const getQuizHistory = async (req, res) => {
    try {
        const attempts = await QuizAttempt.find({ user: req.user.userId })
            .sort({ completedAt: -1 })
            .populate('quiz', 'title category difficulty')
            .limit(20);

        res.status(200).json(attempts);
    } catch (error) {
        res.status(500).json({ message: "Error fetching quiz history" });
    }
};

export const getLeaderboard = async (req, res) => {
    try {
        const { category, timeframe } = req.query;
        let dateFilter = {};

        if (timeframe === 'daily') {
            dateFilter = { 
                completedAt: { 
                    $gte: new Date(Date.now() - 24*60*60*1000) 
                } 
            };
        } else if (timeframe === 'weekly') {
            dateFilter = { 
                completedAt: { 
                    $gte: new Date(Date.now() - 7*24*60*60*1000) 
                } 
            };
        }

        const leaderboard = await QuizAttempt.aggregate([
            {
                $match: {
                    ...(category && { category }),
                    ...dateFilter
                }
            },
            {
                $group: {
                    _id: "$user",
                    totalScore: { $sum: "$score" },
                    averageTime: { $avg: "$timeSpent" },
                    quizzesTaken: { $sum: 1 }
                }
            },
            {
                $sort: { totalScore: -1 }
            },
            {
                $limit: 10
            },
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "userDetails"
                }
            },
            {
                $unwind: "$userDetails"
            },
            {
                $project: {
                    username: "$userDetails.username",
                    totalScore: 1,
                    averageTime: 1,
                    quizzesTaken: 1,
                    streak: "$userDetails.streak"
                }
            }
        ]);

        res.status(200).json(leaderboard);
    } catch (error) {
        console.error("Error fetching leaderboard:", error);
        res.status(500).json({ message: "Error fetching leaderboard" });
    }
}; 