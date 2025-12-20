import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Title is required"]
    },
    author: String,
    year: {
        type: Number,
        min: [1990, "Year must be positive"]
    }
});


export default mongoose.model("Book", bookSchema);
