-- CreateTable
CREATE TABLE "UserBookRating" (
    "userId" INTEGER NOT NULL,
    "bookId" INTEGER NOT NULL,
    "rating" INTEGER NOT NULL,

    CONSTRAINT "UserBookRating_pkey" PRIMARY KEY ("userId","bookId")
);

-- AddForeignKey
ALTER TABLE "UserBookRating" ADD CONSTRAINT "UserBookRating_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserBookRating" ADD CONSTRAINT "UserBookRating_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE CASCADE ON UPDATE CASCADE;
