/*
  Warnings:

  - The primary key for the `Book` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `UserBookReadingState` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `bookId` on the `UserBookReadingState` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `B` on the `_AuthorToBook` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `A` on the `_BookToPublisher` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `A` on the `_BookToSubject` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.

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
ADD COLUMN     "id" SERIAL NOT NULL,
ALTER COLUMN "isbn" SET DATA TYPE TEXT,
ALTER COLUMN "isbn10" SET DATA TYPE TEXT,
ALTER COLUMN "isbn13" SET DATA TYPE TEXT,
ADD CONSTRAINT "Book_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "UserBookReadingState" DROP CONSTRAINT "UserBookReadingState_pkey",
ALTER COLUMN "bookId" SET DATA TYPE INTEGER,
ADD CONSTRAINT "UserBookReadingState_pkey" PRIMARY KEY ("userId", "bookId");

-- AlterTable
ALTER TABLE "_AuthorToBook" ALTER COLUMN "B" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "_BookToPublisher" ALTER COLUMN "A" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "_BookToSubject" ALTER COLUMN "A" SET DATA TYPE INTEGER;

-- AddForeignKey
ALTER TABLE "UserBookReadingState" ADD CONSTRAINT "UserBookReadingState_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BookToPublisher" ADD CONSTRAINT "_BookToPublisher_A_fkey" FOREIGN KEY ("A") REFERENCES "Book"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BookToSubject" ADD CONSTRAINT "_BookToSubject_A_fkey" FOREIGN KEY ("A") REFERENCES "Book"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AuthorToBook" ADD CONSTRAINT "_AuthorToBook_B_fkey" FOREIGN KEY ("B") REFERENCES "Book"("id") ON DELETE CASCADE ON UPDATE CASCADE;
