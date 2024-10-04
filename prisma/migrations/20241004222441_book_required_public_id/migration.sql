/*
  Warnings:

  - A unique constraint covering the columns `[publicId]` on the table `Book` will be added. If there are existing duplicate values, this will fail.
  - Made the column `publicId` on table `Book` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Book" ALTER COLUMN "publicId" SET NOT NULL,
ALTER COLUMN "publicId" DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX "Book_publicId_key" ON "Book"("publicId");
