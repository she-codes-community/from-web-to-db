import express from "express";
import cors from "cors";
import { hashPassword, comparePassword, auth, createToken, requireRoles, validateEmailAndPassword } from "./auth.js";

const app = express();

/******************** For Mongoose ********************/
import Book from "./mongomodels/book.js";
import User from "./mongomodels/user.js";
import { connectDB, mongoResponseIdMiddleware } from "./mongodb.js";
connectDB();
app.use(mongoResponseIdMiddleware); //Mongo specific middleware

/******************** For Prisma ********************/
// import { prisma, toPrismaId } from "./prisma.js";

/******************** General Middleware ********************/
app.use(cors({ origin: "http://localhost:5175" }));
app.use(express.json());

/******************** Server ********************/
app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});

/******************** Book CRUD Routes ********************/
app.get("/api/books", auth, async (req, res) => {
    try {
        // Mongoose -->
        const books = await Book.find();

        // Prisma -->
        // const books = await prisma.book.findMany();

        return res.status(200).json(books);
    } catch (err) {
        console.error("GET /api/books failed:", err);
        return res.status(500).json({ error: "Failed to fetch books" });
    }
});

app.get("/api/books/:id", auth, requireRoles(["reader", "librarian"]), async (req, res) => {
    const { id } = req.params;

    try {
        // Mongoose -->
        const book = await Book.findById(id);

        // Prisma -->
        // const numericId = toPrismaId(id);
        // const book = await prisma.book.findUnique({where: { id: numericId },})

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

        // Return 400 if the title is empty
        if (!title) {
            return res.status(400).json({ error: "title is required" });
        }

        // Return 400 if the year is not numeric
        const yearNum =
            year === undefined || year === null || year === ""
                ? undefined
                : Number(year);
        if (yearNum !== undefined && !Number.isInteger(yearNum)) {
            return res.status(400).json({ error: "year must be a number" });
        }

        // Mongoose -->
        const newBook = await Book.create({title,author,year,});

        // Prisma -->
        // const newBook = await prisma.book.create({data: { title, author, year }});

        res.status(201).json(newBook);
    } catch (err) {
        console.error("POST /api/books", err);
        return res.status(500).json({ error: "Failed to create book" });
    }
});

app.put("/api/books/:id", auth, requireRoles("librarian"), async (req, res) => {
    try {
        //Mongoose -->
        const updatedBook = await Book.findByIdAndUpdate(
           req.params.id,
           req.body,
           { new: true, runValidators: true });
        if (!updatedBook) { return res.status(404).json({ error: "Book not found" });}

        // Prisma -->
        // const numericId = toPrismaId(req.params.id);
        // const existing = await prisma.book.findUnique({
        //     where: { id: numericId },
        //     select: { id: true },
        // });
        // if (!existing) return res.status(404).json({ error: "Book not found" });
        // const updatedBook = await prisma.book.update({
        //     where: { id: numericId },
        //     data: req.body,
        // });


        return res.status(200).json(updatedBook);
    } catch (err) {
        console.error("PUT /api/books/:id", err);
        return res.status(500).json({ error: "Failed to update book" });
    }
});

app.delete("/api/books/:id", auth, requireRoles("librarian"), async (req, res) => {
    const { id } = req.params;

    try {
        // Mongoose -->
        const deleted = await Book.findByIdAndDelete(id);
        if (!deleted) {return res.status(404).json({ error: "Book not found" });}

        // Prisma -->
        // const numericId = toPrismaId(id);
        // const existing = await prisma.book.findUnique({
        //     where: { id: numericId },
        //     select: { id: true },
        // });
        // if (!existing) {return res.status(404).json({ error: "Book not found" });}
        //
        // await prisma.book.delete({
        //     where: { id: numericId },
        // });


        return res.status(200).json({ message: "Deleted", id });
    } catch (err) {
        console.error("DELETE /api/books/:id", err);
        return res.status(500).json({ error: "Failed to delete book" });
    }
});

/******************** Auth Routes ********************/
app.post("/api/users/signup", async (req, res) => {
    const { email, password } = validateEmailAndPassword(req.body);

    try {

        // Mongoose -->
        const existing = await User.findOne({ email });

        // Prisma -->
        // const existing = await prisma.user.findUnique({ where: { email } });


        // If user already exists -> return 409
        if (existing) {
            return res.status(409).json({ error: "user already exists" });
        }

        const hashedPassword = await hashPassword(password);

        // Mongoose -->
        const newUser = await User.create({email, password: hashedPassword});

        // Prisma -->
        // const newUser = await prisma.user.create({
        //     data: { email, password: hashedPassword }
        // });

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
        // Mongoose -->
        const user = await User.findOne({ email });

        // Prisma -->
        // const user = await prisma.user.findUnique({ where: { email } });


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

/******************** Borrow Routes - only Prisma ********************/
/*
app.post("/api/borrows", auth, async (req, res) => {
    try {
        // 401: no authorization header
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        // 400: Invalid bookId
        const rawBookId = req.body?.bookId;
        const bookId = Number(rawBookId);
        if (!Number.isInteger(bookId)) {
            return res.status(400).json({ message: "Invalid bookId" });
        }

        // 404: No such book
        const book = await prisma.book.findUnique({
            where: { id: bookId },
            select: { id: true },
        });
        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        // 409: Book already borrowed
        const activeBorrowForBook = await prisma.borrow.findFirst({
            where: {
                bookId,
                returnedAt: null,
            },
            select: { id: true },
        });

        if (activeBorrowForBook) {
            return res.status(409).json({ message: "Book is already borrowed" });
        }

        // Borrowing the book
        const borrow = await prisma.borrow.create({
            data: {
                userId,
                bookId,
            },
        });

        return res.status(201).json(borrow);
    } catch (err) {
        console.error("POST /api/borrows", err);
        return res.status(500).json({ error: "Failed to borrow" });
    }
});

app.patch("/api/borrows/:id/return", auth, async (req, res) => {
    try {
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const borrowId = Number(req.params.id);

        // 400
        if (!Number.isInteger(borrowId)) {
            return res.status(400).json({ message: "Invalid borrow id" });
        }

        // 404
        const borrow = await prisma.borrow.findUnique({
            where: { id: borrowId },
        });

        if (!borrow) {
            return res.status(404).json({ message: "Borrow not found" });
        }

        // 403
        if (borrow.userId !== userId) {
            return res.status(403).json({ message: "Not your book to return" });
        }

        // 409
        if (borrow.returnedAt) {
            return res.status(409).json({ message: "Book already returned" });
        }

        // Mark as returned
        const updated = await prisma.borrow.update({
            where: { id: borrowId },
            data: { returnedAt: new Date() },
        });

        return res.json(updated);
    } catch (err) {
        console.error("PATCH /api/borrows/:id/return", err);
        return res.status(500).json({ error: "Failed to return" });
    }
});

app.get("/api/users/:id/borrows", auth, requireRoles("librarian"), async (req, res) => {
    try {
        // 401
        if (!req.userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const userIdParam = Number(req.params.id);

        // 400
        if (!Number.isInteger(userIdParam)) {
            return res.status(400).json({ message: "Invalid user id" });
        }

        // 404
        const userExists = await prisma.user.findUnique({
            where: { id: userIdParam },
            select: { id: true },
        });

        if (!userExists) {
            return res.status(404).json({ message: "User not found" });
        }

        // Books the user borrowed
        const borrows = await prisma.borrow.findMany({
            where: { userId: userIdParam },
            orderBy: { borrowedAt: "desc" },
            include: {
                book: true,
            },
        });

        return res.json(borrows);
    } catch (err) {
        console.error("PATCH /api/borrows/:id/return", err);
        return res.status(500).json({ error: "Failed to return" });
    }
});
*/

export default app;