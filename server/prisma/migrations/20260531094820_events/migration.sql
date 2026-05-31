-- CreateTable
CREATE TABLE "Event" (
    "id" SERIAL NOT NULL,
    "topic" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "dateTime" TIMESTAMP(3) NOT NULL,
    "maxGuests" INTEGER NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);
