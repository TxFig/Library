/*
  Warnings:

  - You are about to drop the column `back_image` on the `Book` table. All the data in the column will be lost.
  - You are about to drop the column `front_image` on the `Book` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Book" DROP COLUMN "back_image",
DROP COLUMN "front_image";

-- CreateTable
CREATE TABLE "Image" (
    "id" SERIAL NOT NULL,
    "bookId_front_image" INTEGER NOT NULL,
    "bookId_back_image" INTEGER NOT NULL,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_bookId_front_image_fkey" FOREIGN KEY ("bookId_front_image") REFERENCES "Book"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_bookId_back_image_fkey" FOREIGN KEY ("bookId_back_image") REFERENCES "Book"("id") ON DELETE CASCADE ON UPDATE CASCADE;
