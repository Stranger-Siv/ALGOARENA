import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true, 
        unique: true
    },
    email:{
        type: String,
        required: true, 
        unique: true
    },
    password:{
        type: String,
        required: true,
        select: false,
    },
    score:{
        type: Number,
        default: 0
    },
    streak:{
        type: Number,
        default: 0
    },
    milestones:[{
        type: Number
    }]
},{timestamps: true})

export default mongoose.model("User", userSchema)