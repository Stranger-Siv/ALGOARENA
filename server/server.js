import express from "express"
import dotenv from "dotenv"
import dbConnection from "./config/connectionDB.js"
import cors from "cors"
import quizRoutes from "./routes/quizRoutes.js"

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

app.use("/api/quizzes", quizRoutes)

dbConnection()

app.listen(process.env.PORT,()=>{
    console.log(`Server listning at port ${process.env.PORT}`);
})