import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import User from "../models/User.js"

export const registerUser = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        console.log('Registration attempt:', { email, username });

        const existingUser = await User.findOne({email})
        if(existingUser) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        const isFirstUser = (await User.countDocuments({})) === 0;

        if (role === 'admin' && !isFirstUser) {
            const token = req.cookies.token || req.query.token || req.body.token;
            if (!token) {
                return res.status(403).json({
                    message: "Admin creation requires authentication"
                });
            }

            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                const requestingUser = await User.findById(decoded.userId);
                if (!requestingUser || requestingUser.role !== 'admin') {
                    return res.status(403).json({
                        message: "Only existing admins can create new admin accounts"
                    });
                }
            } catch (error) {
                return res.status(403).json({
                    message: "Invalid authentication for admin creation"
                });
            }
        }

        console.log('Hashing password...');
        const hashedPassword = await bcrypt.hash(password, 12);    
        console.log('Password hashed successfully. Hash length:', hashedPassword.length);

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            role: isFirstUser ? 'admin' : (role === 'admin' ? 'admin' : 'user') 
        });

        await newUser.save();
        console.log('User saved to database with hashed password');

        const token = jwt.sign(
            { userId: newUser._id },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: "7d" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: "/"
        });

        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                role: newUser.role
            },
            token
        });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({
            message: "Error during registration",
            error: error.message
        });
    }
};

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        console.log('Login attempt details:', {
            email,
            passwordLength: password?.length,
            timestamp: new Date().toISOString()
        });
        
        if (!email || !password) {
            console.log('Validation failed:', { email: !!email, password: !!password });
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        const user = await User.findOne({email}).select("+password");
        console.log('Database query result:', {
            userFound: !!user,
            email: email,
            userEmail: user?.email,
            hasPassword: !!user?.password
        });
        
        if(!user) {
            console.log('User not found in database:', email);
            return res.status(400).json({
                message: "Invalid email or password"
            });
        }

        console.log('Password verification attempt:', {
            storedHashLength: user.password?.length,
            inputPasswordLength: password?.length,
            emailMatches: user.email === email
        });
        
        const isMatch = await bcrypt.compare(password, user.password);
        console.log('Password verification result:', {
            isMatch,
            email: email
        });
        
        if (!isMatch) {
            console.log('Password verification failed for:', email);
            return res.status(400).json({
                message: "Invalid email or password"
            });
        }

        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: "7d" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: "/"
        });

        console.log('Authentication successful:', {
            email: email,
            tokenGenerated: !!token,
            cookieSet: true
        });

        const userWithoutPassword = user.toObject();
        delete userWithoutPassword.password;

        res.status(200).json({
            user: userWithoutPassword,
            token,
            debug: {
                cookieSet: true,
                tokenLength: token.length,
                cookieHeader: res.getHeader('Set-Cookie')
            }
        });
    } catch (error) {
        console.error("Login error:", {
            error: error.message,
            stack: error.stack,
            email: req.body.email
        });
        res.status(500).json({
            message: "Login failed, please try again",
            error: error.message
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

export const logoutUser = async (req, res) => {
    try {
        res.cookie("token", "", {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            expires: new Date(0),
            path: "/"
        });
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error logging out" });
    }
};

export const addAdmin = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const requestingUser = await User.findById(req.user.userId);
        if (!requestingUser || requestingUser.role !== 'admin') {
            return res.status(403).json({
                message: "Only admins can create new admin accounts"
            });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: "User with this email already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const newAdmin = new User({
            username,
            email,
            password: hashedPassword,
            role: 'admin'
        });

        await newAdmin.save();

        res.status(201).json({
            message: "Admin user created successfully",
            admin: {
                id: newAdmin._id,
                username: newAdmin.username,
                email: newAdmin.email,
                role: newAdmin.role
            }
        });
    } catch (error) {
        console.error("Error creating admin:", error);
        res.status(500).json({
            message: "Error creating admin user"
        });
    }
};