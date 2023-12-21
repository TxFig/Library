/*
  Warnings:

  - The primary key for the `Book` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `UserBookReadingState` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "UserBookReadingState" DROP CONSTRAINT "UserBookReadingState_bookId_fkey";

-- DropForeignKey
ALTER TABLE "_AuthorToBook" DROP CONSTRAINT "_AuthorToBook_B_fkey";

-- DropForeignKey
ALTER TABLE "_BookToPublisher" DROP CONSTRAINT "_BookToPublisher_A_fkey";

-- DropForeignKey
ALTER TABLE "_BookToSubject" DROP CONSTRAINT "_BookToSubject_A_fkey";

-- AlterTable
ALTER TABLE "Book" DROP CONSTRAINT "Book_pkey",
ALTER COLUMN "isbn" SET DATA TYPE BIGINT,
ALTER COLUMN "isbn13" SET DATA TYPE BIGINT,
ADD CONSTRAINT "Book_pkey" PRIMARY KEY ("isbn");

-- AlterTable
ALTER TABLE "UserBookReadingState" DROP CONSTRAINT "UserBookReadingState_pkey",
ALTER COLUMN "bookId" SET DATA TYPE BIGINT,
ADD CONSTRAINT "UserBookReadingState_pkey" PRIMARY KEY ("userId", "bookId");

-- AlterTable
ALTER TABLE "_AuthorToBook" ALTER COLUMN "B" SET DATA TYPE BIGINT;

-- AlterTable
ALTER TABLE "_BookToPublisher" ALTER COLUMN "A" SET DATA TYPE BIGINT;

-- AlterTable
ALTER TABLE "_BookToSubject" ALTER COLUMN "A" SET DATA TYPE BIGINT;

-- AddForeignKey
ALTER TABLE "UserBookReadingState" ADD CONSTRAINT "UserBookReadingState_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("isbn") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BookToPublisher" ADD CONSTRAINT "_BookToPublisher_A_fkey" FOREIGN KEY ("A") REFERENCES "Book"("isbn") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BookToSubject" ADD CONSTRAINT "_BookToSubject_A_fkey" FOREIGN KEY ("A") REFERENCES "Book"("isbn") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AuthorToBook" ADD CONSTRAINT "_AuthorToBook_B_fkey" FOREIGN KEY ("B") REFERENCES "Book"("isbn") ON DELETE CASCADE ON UPDATE CASCADE;
