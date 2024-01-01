import mongoose from "mongoose";

export async function connectToMongo(){
    try{
        await mongoose.connect(process.env.DB_URI);
        console.log("Connected to Database");
    }
    catch(error)
    {
        console.error(error);
        process.exit(1)
    }
}