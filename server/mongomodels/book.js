import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Title is required"]
    },
    author: String,
    year: {
        type: Number,
        min: [1990, "Year must be greater than 1990"]
    },
    rating: {
        type: Number,
        min: [1, "Rating must be at least 1"],
        max: [5, "Rating must be at most 5"]
    }
});


export default mongoose.model("Book", bookSchema);