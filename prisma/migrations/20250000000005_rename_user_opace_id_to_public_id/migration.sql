/*
  Warnings:

  - You are about to drop the column `opaqueId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `profilePicture` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[publicId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `publicId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "User_opaqueId_key";

-- AlterTable
ALTER TABLE "User" RENAME COLUMN "opaqueId" TO "publicId";
ALTER TABLE "User" DROP COLUMN "profilePicture";

-- CreateIndex
CREATE UNIQUE INDEX "User_publicId_key" ON "User"("publicId");


ALTER TABLE "User" ALTER COLUMN "publicId" SET DEFAULT generate_public_id();
