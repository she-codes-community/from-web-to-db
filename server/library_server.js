import express from "express";
import cors from "cors";

import { hashPassword, comparePassword, auth, createToken, validateEmailAndPassword } from "./auth.js";

/******************** For Mongoose ********************/
import Book from "./mongomodels/book.js";
import User from "./mongomodels/user.js";
import { connectDB } from "./mongodb.js";
connectDB();

/******************** Rest of the application ********************/
const app = express();

/******************** General Middleware ********************/
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

/******************** Book CRUD Routes ********************/
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
            { returnDocument: "after", runValidators: true }
        );

        if (!updatedBook) {
            return res.status(404).json({ error: "Book not found" });
        }

        res.json(updatedBook);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.delete("/api/books/:id", auth, async (req, res) => {
    const { id } = req.params;

    try {
        // Mongoose -->
        const deleted = await Book.findByIdAndDelete(id);
        if (!deleted) {return res.status(404).json({ error: "Book not found" });}

        return res.status(200).json({ message: "Deleted", id });
    } catch (err) {
        console.error("DELETE /api/books/:id", err);
        return res.status(500).json({ error: "Failed to delete book" });
    }
});

/******************** Server ********************/
app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});

/******************** Auth Routes ********************/
app.post("/api/users/signup", async (req, res) => {
    try {
        const { email, password } = validateEmailAndPassword(req.body);

        const existing = await User.findOne({ email });

        // If user already exists -> return 409
        if (existing) {
            return res.status(409).json({ error: "user already exists" });
        }

        const hashedPassword = await hashPassword(password);
        const newUser = await User.create({email, password: hashedPassword});

        // User created -> return 201
        return res.status(201).json({ message: "user created" });
    } catch (err) {
        if (err.message === "EMAIL_PASSWORD_REQUIRED") {
            return res.status(400).json({ error: "email and password are required" });
        }
        if (err.message === "INVALID_EMAIL") {
            return res.status(400).json({ error: "invalid email" });
        }
        if (err.message === "PASSWORD_TOO_SHORT") {
            return res.status(400).json({ error: "password too short" });
        }

        console.error("POST /api/users/signup", err);
        return res.status(500).json({ error: "Failed to create user" });
    }
});

app.post("/api/users/login", async (req, res) => {
    let { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: "email and password are required" });
    }
    email = email.trim().toLowerCase();

    try {
        const user = await User.findOne({ email });

        // If user not found -> return 401
        if (!user) {
            return res.status(401).json({ error: "invalid credentials" });
        }

        // Compare password with the stored one
        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: "invalid credentials" });
        }

        // User is found and password if correct -> create the token with current user
        const token = createToken(user);

        return res.status(200).json({
            token,
            user: { id: user.id, email: user.email, role: user.role },
        });
    } catch (err) {
        console.error("POST /api/users/login", err);
        return res.status(500).json({ error: "Failed to login" });
    }
});

