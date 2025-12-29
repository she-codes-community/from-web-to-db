import express from "express";
const app = express();

/******************** For Mongoose ********************/
import Book from "./mongomodels/book.js";
import { connectDB } from "./mongodb.js";
connectDB();

/******************** Server ********************/
app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});

/******************** Routes ********************/
app.get("/api/books", async (req, res) => {
    const books = await Book.find();
    res.json(books);
});

