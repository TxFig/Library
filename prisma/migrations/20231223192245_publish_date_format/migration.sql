/*
  Warnings:

  - You are about to drop the column `publish_date` on the `Book` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Book" DROP COLUMN "publish_date",
ADD COLUMN     "publishDateId" INTEGER;

-- CreateTable
CREATE TABLE "PublishDate" (
    "id" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "month" INTEGER,
    "day" INTEGER,

    CONSTRAINT "PublishDate_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Book" ADD CONSTRAINT "Book_publishDateId_fkey" FOREIGN KEY ("publishDateId") REFERENCES "PublishDate"("id") ON DELETE SET NULL ON UPDATE CASCADE;
