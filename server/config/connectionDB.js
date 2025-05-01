import mongoose from "mongoose";

const dbConnection = () => {
    mongoose.connect(process.env.MONGO_URI,{
        dbName: "ALGOARENA"
    }).then(()=>{
        console.log("Connected to Database")
    }).catch((error)=>{
        console.log(`Some Error Occoured While Connecting To Database ${error}`)
    })
}

export default dbConnection;