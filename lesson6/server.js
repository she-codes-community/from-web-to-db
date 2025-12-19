import express from "express";
import Book from "./models/book.js";

const app = express();

app.get("/api/books", async (req, res) => {
    const books = await Book.find();
    res.json(books);
});


app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
