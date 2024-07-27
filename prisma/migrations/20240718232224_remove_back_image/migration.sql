/*
  Warnings:

  - You are about to drop the column `bookId_back_image` on the `Image` table. All the data in the column will be lost.
  - You are about to drop the column `bookId_front_image` on the `Image` table. All the data in the column will be lost.
  - Added the required column `bookId` to the `Image` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Image" DROP CONSTRAINT "Image_bookId_back_image_fkey";

-- DropForeignKey
ALTER TABLE "Image" DROP CONSTRAINT "Image_bookId_front_image_fkey";

-- AlterTable
ALTER TABLE "Image" DROP COLUMN "bookId_back_image",
DROP COLUMN "bookId_front_image",
ADD COLUMN     "bookId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
