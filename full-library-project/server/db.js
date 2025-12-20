import mongoose from "mongoose";

const MONGO_URL = "mongodb+srv://dbuser:password@cluster0.5xnjzxa.mongodb.net/libraryDB";

export async function connectDB() {
    try {
        await mongoose.connect(MONGO_URL);
        console.log("Connected to MongoDB");
    } catch (err) {
        console.error("MongoDB error:", err);
    }
}
