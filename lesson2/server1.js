import express from "express";

const app = express();
app.get("/", (req, res) => {
    res.json({ message: "Hello from Express!" });
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));

app.get("/users", (req, res) => {
    res.send("Here is the list of users");
});

app.get("/users/:id", (req, res) => {
    res.send(`User ID: ${req.params.id}`);
});

app.post("/users", (req, res) => {
    res.send("New user created");
});

app.put("/users/:id", (req, res) => {
    res.send(`User ${req.params.id} updated`);
});

app.delete("/users/:id", (req, res) => {
    res.send(`User ${req.params.id} deleted`);
});