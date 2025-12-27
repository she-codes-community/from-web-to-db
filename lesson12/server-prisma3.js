app.post("/api/books", async (req, res) => {
    const { title, author, year } = req.body;

    const newBook = await prisma.book.create({
        data: { title, author, year }
    });

    res.status(201).json(newBook);
});
