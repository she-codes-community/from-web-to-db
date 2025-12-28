app.patch("/api/borrows/:id/return", auth, async (req, res) => {
    try {
        const borrowId = Number(req.params.id);

        // 400: id לא תקין
        if (!Number.isInteger(borrowId)) {
            return res.status(400).json({ message: "Invalid borrow id" });
        }

        // 404: אין השאלה כזו
        const borrow = await prisma.borrow.findUnique({
            where: { id: borrowId },
        });

        if (!borrow) {
            return res.status(404).json({ message: "Borrow not found" });
        }
        // 403: זו לא ההשאלה של הקוראת המחוברת
        if (borrow.userId !== req.userId) {
            return res.status(403).json({ message: "Not your borrow" });
        }

        // 409: כבר הוחזר
        if (borrow.returnedAt) {
            return res.status(409).json({ message: "Borrow already returned" });
        }

        // הצלחה: מסמנים החזרה
        const updated = await prisma.borrow.update({
            where: { id: borrowId },
            data: { returnedAt: new Date() },
        });

        return res.json(updated);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
});

