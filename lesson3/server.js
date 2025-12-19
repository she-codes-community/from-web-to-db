app.post("/api/books", (req, res) => {
    const newBook = {
        id: Date.now(),
        ...req.body
    };

    books.push(newBook);
    res.status(201).json(newBook);
});
