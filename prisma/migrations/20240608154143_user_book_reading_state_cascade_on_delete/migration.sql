-- AlterEnum
ALTER TYPE "ReadingState" ADD VALUE 'NOT_READ';

-- DropForeignKey
ALTER TABLE "UserBookReadingState" DROP CONSTRAINT "UserBookReadingState_bookId_fkey";

-- DropForeignKey
ALTER TABLE "UserBookReadingState" DROP CONSTRAINT "UserBookReadingState_userId_fkey";

-- AddForeignKey
ALTER TABLE "UserBookReadingState" ADD CONSTRAINT "UserBookReadingState_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserBookReadingState" ADD CONSTRAINT "UserBookReadingState_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("isbn") ON DELETE CASCADE ON UPDATE CASCADE;
