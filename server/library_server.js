import "dotenv/config";
import express from "express";
import cors from "cors";

import { hashPassword, comparePassword, auth, createToken, requireRoles, validateEmailAndPassword } from "./auth.js";

/******************** For Prisma ********************/
import { prisma, toPrismaId } from "./prisma.js";

// Mongoose -->
// import Book from "./mongomodels/book.js";
// import User from "./mongomodels/user.js";
// import { connectDB } from "./mongodb.js";
// connectDB();

const app = express();

/******************** General Middleware ********************/
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

/******************** Book CRUD Routes ********************/
app.get("/api/books", auth, async (req, res) => {
    try {
        // Prisma -->
        const books = await prisma.book.findMany();

        // Mongoose -->
        // const books = await Book.find();

        return res.status(200).json(books);
    } catch (err) {
        console.error("GET /api/books failed:", err);
        return res.status(500).json({ error: "Failed to fetch books" });
    }
});

app.get("/api/books/:id", auth, requireRoles(["reader", "librarian"]), async (req, res) => {
    const { id } = req.params;

    try {
        // Prisma -->
        const numericId = toPrismaId(id);
        const book = await prisma.book.findUnique({ where: { id: numericId } });

        // Mongoose -->
        // const book = await Book.findById(id);

        if (!book) {
            return res.status(404).json({ error: "Book not found" });
        }

        return res.status(200).json(book);
    } catch (err) {
        console.error("GET /api/books/:id", err);
        return res.status(500).json({ error: "Failed to fetch book" });
    }
});

app.post("/api/books", auth, requireRoles("librarian"), async (req, res) => {
    try {
        const { title, author, year } = req.body;

        if (!title) {
            return res.status(400).json({ error: "title is required" });
        }

        const yearNum =
            year === undefined || year === null || year === ""
                ? undefined
                : Number(year);
        if (yearNum !== undefined && !Number.isInteger(yearNum)) {
            return res.status(400).json({ error: "year must be a number" });
        }

        // Prisma -->
        const newBook = await prisma.book.create({ data: { title, author, year } });

        // Mongoose -->
        // const newBook = await Book.create({ title, author, year });

        res.status(201).json(newBook);
    } catch (err) {
        console.error("POST /api/books", err);
        return res.status(500).json({ error: "Failed to create book" });
    }
});

app.put("/api/books/:id", auth, requireRoles("librarian"), async (req, res) => {
    try {
        // Prisma -->
        const numericId = toPrismaId(req.params.id);
        const existing = await prisma.book.findUnique({
            where: { id: numericId },
            select: { id: true },
        });
        if (!existing) return res.status(404).json({ error: "Book not found" });
        const updatedBook = await prisma.book.update({
            where: { id: numericId },
            data: req.body,
        });

        // Mongoose -->
        // const updatedBook = await Book.findByIdAndUpdate(
        //     req.params.id,
        //     req.body,
        //     { new: true, runValidators: true }
        // );
        // if (!updatedBook) { return res.status(404).json({ error: "Book not found" }); }

        return res.status(200).json(updatedBook);
    } catch (err) {
        console.error("PUT /api/books/:id", err);
        return res.status(500).json({ error: "Failed to update book" });
    }
});

app.delete("/api/books/:id", auth, requireRoles("librarian"), async (req, res) => {
    const { id } = req.params;

    try {
        // Prisma -->
        const numericId = toPrismaId(id);
        const existing = await prisma.book.findUnique({
            where: { id: numericId },
            select: { id: true },
        });
        if (!existing) { return res.status(404).json({ error: "Book not found" }); }
        await prisma.book.delete({ where: { id: numericId } });

        // Mongoose -->
        // const deleted = await Book.findByIdAndDelete(id);
        // if (!deleted) { return res.status(404).json({ error: "Book not found" }); }

        return res.status(200).json({ message: "Deleted", id });
    } catch (err) {
        console.error("DELETE /api/books/:id", err);
        return res.status(500).json({ error: "Failed to delete book" });
    }
});

/******************** Auth Routes ********************/
app.post("/api/users/signup", async (req, res) => {
    try {
        const { email, password } = validateEmailAndPassword(req.body);

        // Prisma -->
        const existing = await prisma.user.findUnique({ where: { email } });

        // Mongoose -->
        // const existing = await User.findOne({ email });

        if (existing) {
            return res.status(409).json({ error: "user already exists" });
        }

        const hashedPassword = await hashPassword(password);

        // Prisma -->
        await prisma.user.create({ data: { email, password: hashedPassword } });

        // Mongoose -->
        // await User.create({ email, password: hashedPassword });

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
        // Prisma -->
        const user = await prisma.user.findUnique({ where: { email } });

        // Mongoose -->
        // const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ error: "invalid credentials" });
        }

        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: "invalid credentials" });
        }

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

/******************** Server ********************/
app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
