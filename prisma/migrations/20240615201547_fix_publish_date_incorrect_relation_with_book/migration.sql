/*
  Warnings:

  - You are about to drop the column `publishDateId` on the `Book` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[bookId]` on the table `PublishDate` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `bookId` to the `PublishDate` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Book" DROP CONSTRAINT "Book_publishDateId_fkey";

-- AlterTable
ALTER TABLE "Book" DROP COLUMN "publishDateId";

-- AlterTable
ALTER TABLE "PublishDate" ADD COLUMN     "bookId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "PublishDate_bookId_key" ON "PublishDate"("bookId");

-- AddForeignKey
ALTER TABLE "PublishDate" ADD CONSTRAINT "PublishDate_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE CASCADE ON UPDATE CASCADE;
