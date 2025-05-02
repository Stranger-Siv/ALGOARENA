import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import User from "../models/User.js"
import QuizAttempt from "../models/QuizAttempt.js"

export const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const existingUser = await User.findOne({email})
        if(existingUser) return res.status(400).json({message : "User already exists"})

        const hashedPassword = await bcrypt.hash(password, 12)    

        const newUser = new User({
            username,
            email,
            password: hashedPassword
        })
        await newUser.save()

        const token = jwt.sign({ userId: newUser._id},process.env.JWT_SECRET, {expiresIn: "1d"})
        res.status(201).json({message: "User Registered Successfully", token})
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Error while user registration"})
    }
}

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        const user = await User.findOne({email}).select("+password");
        if(!user) {
            return res.status(400).json({
                message: "Invalid email or password"
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid email or password"
            });
        }

        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" } // Extended to 7 days for convenience
        );

        // Set token in cookie
        res.cookie("token", token, {
            httpOnly: false,
            secure: false,
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            path: "/"
        });

        // Remove password from response
        const userWithoutPassword = user.toObject();
        delete userWithoutPassword.password;

        // Send token in response body as well
        res.status(200).json({
            user: userWithoutPassword,
            token
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({
            message: "Login failed, please try again"
        });
    }
}

export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Error fetching user profile", error });
    }
};

export const updateUserProfile = async (req, res) => {
    try {
        const {username, email, password } = req.body;
        const user = await User.findById(req.user.userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        if (password) {
            user.password = await bcrypt.hash(password, 12);
        }

        user.username = username || user.username;
        user.email = email || user.email;
        await user.save();

        res.status(200).json({ message: "User profile updated successfully", user });
    } catch (error) {
        res.status(500).json({ message: "Error updating user profile", error });
    }
}

export const getUserQuizHistory = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).populate("quizHistory");
        if (!user) return res.status(404).json({ message: "User not found" });

        res.status(200).json({ history: user.quizHistory });
    } catch (error) {
        res.status(500).json({message: "Error fetching quiz history", error})
    }
}