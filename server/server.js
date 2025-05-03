import express from "express";
import dotenv from "dotenv";
import dbConnection from "./config/connectionDB.js";
import cors from "cors";
import quizRoutes from "./routes/quizRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import quizAttemptRoutes from "./routes/quizAttemptRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

// Parse cookies before any other middleware
app.use(cookieParser());

// Configure CORS with specific origin and credentials
app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Set-Cookie'],
    exposedHeaders: ['Set-Cookie']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/quizzes", quizRoutes);
app.use("/api/users", userRoutes);
app.use("/api/attempts", quizAttemptRoutes);
app.use("/api/categories", categoryRoutes);

app.get("/", (req, res) => {
    res.send("API is working");
});

dbConnection();

app.listen(process.env.PORT, () => {
    console.log(`Server listening at port ${process.env.PORT}`);
});
