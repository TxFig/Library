/*
  Warnings:

  - Made the column `permissionGroupId` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_permissionGroupId_fkey";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "permissionGroupId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_permissionGroupId_fkey" FOREIGN KEY ("permissionGroupId") REFERENCES "PermissionGroup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
