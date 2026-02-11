app.put("/api/books/:id", async (req, res) => {
    try {
        // Code that updates the requested book …

        res.status(200).json(book);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
