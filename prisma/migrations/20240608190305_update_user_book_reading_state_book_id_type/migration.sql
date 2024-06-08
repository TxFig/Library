-- DropForeignKey
ALTER TABLE "UserBookReadingState" DROP CONSTRAINT "UserBookReadingState_bookId_fkey";

-- AddForeignKey
ALTER TABLE "UserBookReadingState" ADD CONSTRAINT "UserBookReadingState_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE CASCADE ON UPDATE CASCADE;
