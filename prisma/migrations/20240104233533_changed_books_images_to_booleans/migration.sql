/*
  Warnings:

  - The `front_image` column on the `Book` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `back_image` column on the `Book` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Book" DROP COLUMN "front_image",
ADD COLUMN     "front_image" BOOLEAN NOT NULL DEFAULT false,
DROP COLUMN "back_image",
ADD COLUMN     "back_image" BOOLEAN NOT NULL DEFAULT false;
