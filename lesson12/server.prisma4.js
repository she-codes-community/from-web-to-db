app.put("/api/books/:id", auth, requireRoles("librarian"), async (req, res) => {
    try {
        const numericId = Number(req.params.id);
        const existing = await prisma.book.findUnique({
            where: { id: numericId },
            select: { id: true },
        });
        if (!existing) return res.status(404).json({ error: "Book not found" });
        const updatedBook = await prisma.book.update({
            where: { id: numericId },
            data: req.body,
        });
        return res.status(200).json(updatedBook);
    } catch (err) {
        console.error("PUT /api/books/:id", err);
        return res.status(500).json({ error: "Failed to update book" });
    }});
