import express from "express";
import cors from "cors";

const app = express();

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

/** דאטה בזיכרון */
let books = [
    { id: 1, title: "The Pragmatic Programmer" },
    { id: 2, title: "Clean Code" },
];


app.get("/api/books", (req, res) => {
    res.json(books);
});

app.get("/api/books/:id", (req, res) => {
    const id = Number(req.params.id);
    const book = books.find((b) => b.id === id);
    if (!book) return res.status(404).json({ error: "Book not found" });
    res.json(book);
});

app.post("/api/books", (req, res) => {
    const newBook = {
        id: Date.now(),
        ...req.body
    };

    books.push(newBook);
    res.status(201).json(newBook);
});


app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
