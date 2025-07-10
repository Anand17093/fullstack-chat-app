import mongoose from "mongoose";
export const connectDB=async()=>{
    try{
       const conn = await mongoose.connect(process.env.MONGODB_URL);
       console.log("Connection Successful");
    }
    catch(error){
        console.log(error);
    }
}