app.post("/api/borrows", auth, async (req, res) => {
    const userId = req.userId;
    const bookId = Number(req.body.bookId);

    const borrow = await prisma.borrow.create({
        data: {
            userId,
            bookId
        }
    });

    res.status(201).json(borrow);
});
