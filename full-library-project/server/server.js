import express from "express";
import cors from "cors";
import { connectDB } from "./db.js";
import Book from "./models/book.js";
import User from "./models/user.js";
import { hashPassword, comparePassword, auth, createToken } from "./auth.js";

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
app.get("/api/books", auth, async (req, res) => {
    const books = await Book.find();
    res.json(books);
});


app.get("/api/books/:id", auth, async (req, res) => {
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


app.post("/api/books", auth, async (req, res) => {
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

app.put("/api/books/:id", auth, async (req, res) => {
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

app.delete("/api/books/:id", auth, async (req, res) => {
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

app.post("/api/users/signup", async (req, res) => {
    const { email, password } = req.body;

    // 400 - בדיקות בסיסיות
    if (!email || !password) {
        return res.status(400).json({ error: "email and password are required" });
    }

    // בדיקת אימייל בסיסית (פשוטה)
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: "invalid email" });
    }

    // בדיקת סיסמה בסיסית (פשוטה)
    if (password.length < 6) {
        return res.status(400).json({ error: "password too short" });
    }

    try {
        // 409 - אם כבר קיימת
        const existing = await User.findOne({ email });
        if (existing) {
            return res.status(409).json({ error: "user already exists" });
        }

        const hashedPassword = await hashPassword(password);

        const newUser = await User.create({
            email,
            password: hashedPassword
        });

        // 201 - נוצר
        // לא מחזירים password (גם לא hashed)
        return res.status(201).json({
            _id: newUser._id,
            email: newUser.email
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "server error" });
    }
});

app.post("/api/users/login", async (req, res) => {
    const { email, password } = req.body;

    // 400 - בדיקות בסיסיות
    if (!email || !password) {
        return res.status(400).json({ error: "email and password are required" });
    }

    try {
        // 1) מחפשים משתמשת לפי email
        const user = await User.findOne({ email });
        if (!user) {
            // אני בוחרת 401 (Unauthorized) כי credentials לא נכונים
            return res.status(401).json({ error: "invalid credentials" });
        }

        // 2) בודקים סיסמה מול ה-hash
        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: "invalid credentials" });
        }

        // 3) הצלחה
        const token = createToken(user);

        return res.status(200).json({
            token
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "server error" });
    }
});


export default app;