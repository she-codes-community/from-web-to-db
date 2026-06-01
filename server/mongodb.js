import "dotenv/config";
import mongoose from "mongoose";

// This is something we didn't cover in class: 
// instead of putting the connection string, which contains sensitive information, in the code, 
// we read with from something called an environemt variable. 
// Copy the file .env.example to a new file called .env, and update it 
// according to the instructions in the file.
const MONGO_URL = process.env.MONGO_URL;

export async function connectDB() {
    try {
        await mongoose.connect(MONGO_URL);
        console.log("Connected to MongoDB");
    } catch (err) {
        console.error("MongoDB error:", err);
    }
}
