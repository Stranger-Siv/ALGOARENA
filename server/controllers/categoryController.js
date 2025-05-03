import Category from "../models/Category.js";
import Quiz from "../models/Quiz.js";

export const getCategories = async (req, res) => {
    try {
        const categories = await Category.find({ isActive: true })
            .sort({ order: 1, name: 1 });
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: "Error fetching categories" });
    }
};

export const createCategory = async (req, res) => {
    try {
        const { name, displayName, description, icon } = req.body;

        const existingCategory = await Category.findOne({ name: name.toLowerCase() });
        if (existingCategory) {
            return res.status(400).json({
                message: "Category already exists"
            });
        }

        const category = new Category({
            name: name.toLowerCase(),
            displayName,
            description,
            icon
        });

        await category.save();
        res.status(201).json({
            message: "Category created successfully",
            category
        });
    } catch (error) {
        res.status(500).json({ message: "Error creating category" });
    }
};

export const updateCategory = async (req, res) => {
    try {
        const { displayName, description, icon, isActive, order } = req.body;
        const categoryId = req.params.id;

        const category = await Category.findById(categoryId);
        if (!category) {
            return res.status(404).json({
                message: "Category not found"
            });
        }

        if (displayName) category.displayName = displayName;
        if (description) category.description = description;
        if (icon) category.icon = icon;
        if (typeof isActive === 'boolean') category.isActive = isActive;
        if (typeof order === 'number') category.order = order;

        await category.save();
        res.status(200).json({
            message: "Category updated successfully",
            category
        });
    } catch (error) {
        res.status(500).json({ message: "Error updating category" });
    }
};

export const deleteCategory = async (req, res) => {
    try {
        const categoryId = req.params.id;

        const quizCount = await Quiz.countDocuments({ category: categoryId });
        if (quizCount > 0) {
            const category = await Category.findByIdAndUpdate(
                categoryId,
                { isActive: false },
                { new: true }
            );
            return res.status(200).json({
                message: "Category deactivated (has existing quizzes)",
                category
            });
        }

        await Category.findByIdAndDelete(categoryId);
        res.status(200).json({
            message: "Category deleted successfully"
        });
    } catch (error) {
        res.status(500).json({ message: "Error deleting category" });
    }
};

export const getCategoryStats = async (req, res) => {
    try {
        const stats = await Quiz.aggregate([
            {
                $group: {
                    _id: "$category",
                    totalQuizzes: { $sum: 1 },
                    byDifficulty: {
                        $push: {
                            difficulty: "$difficulty",
                            count: 1
                        }
                    }
                }
            }
        ]);

        const categories = await Category.find();
        const result = categories.map(category => {
            const categoryStats = stats.find(s => s._id === category.name) || {
                totalQuizzes: 0,
                byDifficulty: []
            };

            return {
                ...category.toObject(),
                stats: {
                    totalQuizzes: categoryStats.totalQuizzes,
                    byDifficulty: categoryStats.byDifficulty.reduce((acc, curr) => {
                        acc[curr.difficulty] = (acc[curr.difficulty] || 0) + curr.count;
                        return acc;
                    }, {})
                }
            };
        });

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: "Error fetching category statistics" });
    }
}; 