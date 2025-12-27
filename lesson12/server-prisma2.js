app.get("/api/books", async (req, res) => {
    const books = await prisma.book.findMany();
    res.json(books);
});
