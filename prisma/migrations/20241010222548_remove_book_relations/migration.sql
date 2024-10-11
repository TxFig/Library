/*
  Warnings:

  - You are about to drop the column `isbn` on the `Book` table. All the data in the column will be lost.
  - You are about to drop the column `isbn10` on the `Book` table. All the data in the column will be lost.
  - You are about to drop the column `isbn13` on the `Book` table. All the data in the column will be lost.
  - You are about to drop the column `languageId` on the `Book` table. All the data in the column will be lost.
  - You are about to drop the column `locationId` on the `Book` table. All the data in the column will be lost.
  - You are about to drop the column `number_of_pages` on the `Book` table. All the data in the column will be lost.
  - You are about to drop the column `ownerId` on the `Book` table. All the data in the column will be lost.
  - You are about to drop the column `subtitle` on the `Book` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Book` table. All the data in the column will be lost.
  - You are about to drop the column `bookId` on the `Image` table. All the data in the column will be lost.
  - You are about to drop the column `bookId` on the `PublishDate` table. All the data in the column will be lost.
  - The primary key for the `UserBookRating` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `bookId` on the `UserBookRating` table. All the data in the column will be lost.
  - The primary key for the `UserBookReadingState` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `bookId` on the `UserBookReadingState` table. All the data in the column will be lost.
  - You are about to drop the `DatabaseInfo` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_BookToBookCollection` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_BookToPublisher` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `bookEditionId` on table `Image` required. This step will fail if there are existing NULL values in that column.
  - Made the column `editionId` on table `PublishDate` required. This step will fail if there are existing NULL values in that column.
  - Made the column `editionId` on table `UserBookRating` required. This step will fail if there are existing NULL values in that column.
  - Made the column `editionId` on table `UserBookReadingState` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Book" DROP CONSTRAINT "Book_languageId_fkey";

-- DropForeignKey
ALTER TABLE "Book" DROP CONSTRAINT "Book_locationId_fkey";

-- DropForeignKey
ALTER TABLE "Book" DROP CONSTRAINT "Book_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "Image" DROP CONSTRAINT "Image_bookEditionId_fkey";

-- DropForeignKey
ALTER TABLE "Image" DROP CONSTRAINT "Image_bookId_fkey";

-- DropForeignKey
ALTER TABLE "PublishDate" DROP CONSTRAINT "PublishDate_bookId_fkey";

-- DropForeignKey
ALTER TABLE "UserBookRating" DROP CONSTRAINT "UserBookRating_bookId_fkey";

-- DropForeignKey
ALTER TABLE "UserBookRating" DROP CONSTRAINT "UserBookRating_editionId_fkey";

-- DropForeignKey
ALTER TABLE "UserBookReadingState" DROP CONSTRAINT "UserBookReadingState_bookId_fkey";

-- DropForeignKey
ALTER TABLE "UserBookReadingState" DROP CONSTRAINT "UserBookReadingState_editionId_fkey";

-- DropForeignKey
ALTER TABLE "_BookToBookCollection" DROP CONSTRAINT "_BookToBookCollection_A_fkey";

-- DropForeignKey
ALTER TABLE "_BookToBookCollection" DROP CONSTRAINT "_BookToBookCollection_B_fkey";

-- DropForeignKey
ALTER TABLE "_BookToPublisher" DROP CONSTRAINT "_BookToPublisher_A_fkey";

-- DropForeignKey
ALTER TABLE "_BookToPublisher" DROP CONSTRAINT "_BookToPublisher_B_fkey";

-- DropIndex
DROP INDEX "Book_isbn10_key";

-- DropIndex
DROP INDEX "Book_isbn13_key";

-- DropIndex
DROP INDEX "Book_isbn_key";

-- DropIndex
DROP INDEX "PublishDate_bookId_key";

-- AlterTable
ALTER TABLE "Book" DROP COLUMN "isbn",
DROP COLUMN "isbn10",
DROP COLUMN "isbn13",
DROP COLUMN "languageId",
DROP COLUMN "locationId",
DROP COLUMN "number_of_pages",
DROP COLUMN "ownerId",
DROP COLUMN "subtitle",
DROP COLUMN "title";

-- AlterTable
ALTER TABLE "Image" DROP COLUMN "bookId",
ALTER COLUMN "bookEditionId" SET NOT NULL;

-- AlterTable
ALTER TABLE "PublishDate" DROP COLUMN "bookId",
ALTER COLUMN "editionId" SET NOT NULL;

-- AlterTable
ALTER TABLE "UserBookRating" DROP CONSTRAINT "UserBookRating_pkey",
DROP COLUMN "bookId",
ALTER COLUMN "editionId" SET NOT NULL,
ADD CONSTRAINT "UserBookRating_pkey" PRIMARY KEY ("userId", "editionId");

-- AlterTable
ALTER TABLE "UserBookReadingState" DROP CONSTRAINT "UserBookReadingState_pkey",
DROP COLUMN "bookId",
ALTER COLUMN "editionId" SET NOT NULL,
ADD CONSTRAINT "UserBookReadingState_pkey" PRIMARY KEY ("userId", "editionId");

-- DropTable
DROP TABLE "DatabaseInfo";

-- DropTable
DROP TABLE "_BookToBookCollection";

-- DropTable
DROP TABLE "_BookToPublisher";

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_bookEditionId_fkey" FOREIGN KEY ("bookEditionId") REFERENCES "BookEdition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserBookRating" ADD CONSTRAINT "UserBookRating_editionId_fkey" FOREIGN KEY ("editionId") REFERENCES "BookEdition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserBookReadingState" ADD CONSTRAINT "UserBookReadingState_editionId_fkey" FOREIGN KEY ("editionId") REFERENCES "BookEdition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
