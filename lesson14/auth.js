const numericId = Number(userId);
if (Number.isNaN(numericId)) {
    throw new Error("INVALID_PRISMA_ID: " + id);
}

const user = await prisma.user.findUnique({
    where: { id: numericId }
});
