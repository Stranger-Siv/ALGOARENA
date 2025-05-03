import express from "express";
import { registerUser, loginUser, updateUserProfile, getUserProfile, getUserQuizHistory, logoutUser, addAdmin } from "../controllers/userController.js";
import { verifyToken } from "../middlewares/auth.js";
import { isAdmin } from "../middlewares/adminAuth.js";
import User from "../models/User.js";

const router = express.Router();
console.log("userRoutes loaded");

// Debug endpoint to check registered users
router.get("/debug/users", async (req, res) => {
    try {
        const users = await User.find({}, 'email username role createdAt');
        res.json({
            userCount: users.length,
            users: users.map(u => ({
                email: u.email,
                username: u.username,
                role: u.role,
                createdAt: u.createdAt
            }))
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching users", error: error.message });
    }
});

// Debug endpoint to check specific user
router.get("/debug/user/:email", async (req, res) => {
    try {
        const user = await User.findOne({ email: req.params.email }).select('+password');
        if (!user) {
            return res.json({
                found: false,
                email: req.params.email,
                message: "User not found"
            });
        }
        res.json({
            found: true,
            email: user.email,
            username: user.username,
            role: user.role,
            hasPassword: !!user.password,
            passwordLength: user.password?.length,
            createdAt: user.createdAt
        });
    } catch (error) {
        res.status(500).json({ message: "Error checking user", error: error.message });
    }
});

// Test endpoint for token verification
router.get("/verify-token", verifyToken, (req, res) => {
    res.json({
        message: "Token is valid",
        userId: req.user.userId,
        tokenInfo: req.user
    });
});

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/logout", logoutUser);

router.get("/profile", verifyToken, getUserProfile);

router.put("/profile", verifyToken, updateUserProfile);

router.get("/quiz-history", verifyToken, getUserQuizHistory);

router.post("/admin/create", verifyToken, isAdmin, addAdmin);

export default router;