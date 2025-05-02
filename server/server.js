import express from "express";
import dotenv from "dotenv";
import dbConnection from "./config/connectionDB.js";
import cors from "cors";
import quizRoutes from "./routes/quizRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

// Enable CORS with credentials
app.use(cors({
    origin: true,
    credentials: true
}));

// Parse cookies and JSON
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/quizzes", quizRoutes);
app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
    res.send("API is working");
});

// Connect to database
dbConnection();

// Start server
app.listen(process.env.PORT, () => {
    console.log(`Server listening at port ${process.env.PORT}`);
});
