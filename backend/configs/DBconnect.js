import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    mongoose.connect(process.env.MONGO_URI).then(() => {
      console.log("DB connected");
    });
  } catch (error) {
    console.log(" ## Error : Error connecting DB--------- \n", error);
  }
};

export default connectDB;
