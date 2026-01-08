import express from "express";
import prisma from "./prisma.js";

const app = express();

app.listen(3001, () => {
    console.log("Server running on http://localhost:3001");
});

app.use(express.json()); //middleware for JSON conversion of req.body

app.get("/", (req, res) => {
    res.send("Server is running");
});
