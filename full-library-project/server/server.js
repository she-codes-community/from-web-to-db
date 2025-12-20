import express from "express";
import cors from "cors";
import { connectDB } from "./db.js";
import Book from "./models/book.js";

connectDB();

/******************** Server ********************/
const app = express();
app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});

/******************** Middleware ********************/
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

/******************** Routes ********************/
app.get("/api/books", async (req, res) => {
    const books = await Book.find();
    res.json(books);
});


app.get("/api/books/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const book = await Book.findById(id);
        if (!book) {
            return res.status(404).json({ error: "Book not found" });
        }

        res.json(book);
    } catch (err) {
        res.status(400).json({ error: "Invalid book id" });
    }
});


app.post("/api/books", async (req, res) => {
    try {
        const { title, author, year } = req.body;

        if (!title) {
            return res.status(400).json({ error: "title is required" });
        }

        const newBook = await Book.create({
            title,
            author,
            year,
        });

        res.status(201).json(newBook);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
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

        if (!deleted) {
            return res.status(404).json({ error: "Book not found" });
        }

        // אפשר גם res.sendStatus(204) בלי גוף
        return res.status(200).json({ message: "Deleted", id });
    } catch (err) {
        return res.status(400).json({ error: "Invalid book id" });
    }
});