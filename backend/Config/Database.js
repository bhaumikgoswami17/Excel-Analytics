import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const { MONGO_URL } = process.env;  // Changed from MONGODB_URL to MONGO_URL

export const connect = () => {
  mongoose
    .connect(MONGO_URL, {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    })
    .then(() => console.log("Data Base Connection Success"))
    .catch((err) => {
      console.log("DB Connection Failed");
      console.log(err);
      process.exit(1);
    });
};