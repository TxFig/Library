/*
  Warnings:

  - A unique constraint covering the columns `[publicId]` on the table `BookEdition` will be added. If there are existing duplicate values, this will fail.
  - Made the column `publicId` on table `BookEdition` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "BookEdition" ALTER COLUMN "publicId" SET NOT NULL,
ALTER COLUMN "publicId" DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX "BookEdition_publicId_key" ON "BookEdition"("publicId");
