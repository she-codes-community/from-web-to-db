import express from "express";
import cors from "cors";

/******************** For Mongoose ********************/
import Book from "./mongomodels/book.js";
import { connectDB } from "./mongodb.js";
connectDB();

/******************** Rest of the application ********************/
const app = express();

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

app.get("/api/books", async (req, res) => {
  const books = await Book.find();
  res.json(books);
});

app.get("/api/books/:id", async (req, res) => {
    const id = Number(req.params.id);
    const book = await Book.findById(id);
    if (!book) { 
        return res.status(404).json({ error: "Book not found" });
    } 
    res.json(book);
});

app.post("/api/books", async (req, res) => {
    
    const newBook = await Book.create(req.body);
    res.status(201).json(newBook);
});

app.put("/api/books/:id", async (req, res) => {
    try {
        const updatedBook = await Book.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedBook) {
            return res.status(404).json({ error: "Book not found" });
        }

        res.json(updatedBook);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.delete("/api/books/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const deleted = await Book.findByIdAndDelete(id);
        if (!deleted) { return res.status(404).json({ error: "Book not found" }); }
        return res.status(200).json({ message: "Deleted", id });
    } catch (err) {
        console.error("DELETE /api/books/:id", err);
        return res.status(500).json({ error: "Failed to delete book" });
    }
});

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});

