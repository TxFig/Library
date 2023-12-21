-- CreateEnum
CREATE TYPE "ReadingState" AS ENUM ('READING', 'READ');

-- CreateTable
CREATE TABLE "UserBookReadingState" (
    "userId" INTEGER NOT NULL,
    "bookId" INTEGER NOT NULL,
    "state" "ReadingState" NOT NULL,

    CONSTRAINT "UserBookReadingState_pkey" PRIMARY KEY ("userId","bookId")
);

-- AddForeignKey
ALTER TABLE "UserBookReadingState" ADD CONSTRAINT "UserBookReadingState_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserBookReadingState" ADD CONSTRAINT "UserBookReadingState_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("isbn") ON DELETE RESTRICT ON UPDATE CASCADE;
