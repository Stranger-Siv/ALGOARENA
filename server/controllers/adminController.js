import User from '../models/User.js';
import Quiz from '../models/Quiz.js';
import QuizAttempt from '../models/QuizAttempt.js';
import Category from '../models/Category.js';

// Get dashboard statistics
export const getDashboardStats = async (req, res) => {
    try {
        const stats = await Promise.all([
            User.countDocuments(),
            Quiz.countDocuments(),
            QuizAttempt.countDocuments(),
            Category.countDocuments()
        ]);

        res.json({
            totalUsers: stats[0],
            totalQuizzes: stats[1],
            totalAttempts: stats[2],
            totalCategories: stats[3]
        });
    } catch (error) {
        console.error('Error fetching admin stats:', error);
        res.status(500).json({ message: 'Error fetching admin statistics' });
    }
};

// Get recent activities
export const getRecentActivities = async (req, res) => {
    try {
        const recentQuizzes = await Quiz.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .select('title category difficulty createdAt');

        const recentAttempts = await QuizAttempt.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('user', 'username')
            .populate('quiz', 'title')
            .select('score totalQuestions createdAt');

        const recentUsers = await User.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .select('username email createdAt');

        res.json({
            recentQuizzes,
            recentAttempts,
            recentUsers
        });
    } catch (error) {
        console.error('Error fetching recent activities:', error);
        res.status(500).json({ message: 'Error fetching recent activities' });
    }
};

// Get user statistics
export const getUserStats = async (req, res) => {
    try {
        const userStats = await User.aggregate([
            {
                $lookup: {
                    from: 'quizattempts',
                    localField: '_id',
                    foreignField: 'user',
                    as: 'attempts'
                }
            },
            {
                $project: {
                    username: 1,
                    email: 1,
                    totalAttempts: { $size: '$attempts' },
                    averageScore: {
                        $avg: '$attempts.score'
                    }
                }
            },
            {
                $sort: { totalAttempts: -1 }
            },
            {
                $limit: 10
            }
        ]);

        res.json(userStats);
    } catch (error) {
        console.error('Error fetching user statistics:', error);
        res.status(500).json({ message: 'Error fetching user statistics' });
    }
};

// Get quiz statistics
export const getQuizStats = async (req, res) => {
    try {
        const quizStats = await Quiz.aggregate([
            {
                $lookup: {
                    from: 'quizattempts',
                    localField: '_id',
                    foreignField: 'quiz',
                    as: 'attempts'
                }
            },
            {
                $project: {
                    title: 1,
                    category: 1,
                    difficulty: 1,
                    totalAttempts: { $size: '$attempts' },
                    averageScore: {
                        $avg: '$attempts.score'
                    }
                }
            },
            {
                $sort: { totalAttempts: -1 }
            }
        ]);

        res.json(quizStats);
    } catch (error) {
        console.error('Error fetching quiz statistics:', error);
        res.status(500).json({ message: 'Error fetching quiz statistics' });
    }
};

// Get user management data
export const getUsers = async (req, res) => {
    try {
        const users = await User.find()
            .select('-password')
            .sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Error fetching users' });
    }
};

// Update user role
export const updateUserRole = async (req, res) => {
    try {
        const { userId } = req.params;
        const { isAdmin } = req.body;

        const user = await User.findByIdAndUpdate(
            userId,
            { isAdmin },
            { new: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        console.error('Error updating user role:', error);
        res.status(500).json({ message: 'Error updating user role' });
    }
};

// Delete user
export const deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;
        
        // Delete user's quiz attempts
        await QuizAttempt.deleteMany({ user: userId });
        
        // Delete the user
        const user = await User.findByIdAndDelete(userId);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Error deleting user' });
    }
}; 