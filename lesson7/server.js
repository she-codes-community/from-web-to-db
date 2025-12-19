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
