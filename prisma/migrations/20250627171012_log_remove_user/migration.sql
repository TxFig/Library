/*
  Warnings:

  - You are about to drop the column `userId` on the `LogEntry` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "LogEntry" DROP CONSTRAINT "LogEntry_userId_fkey";

-- AlterTable
ALTER TABLE "LogEntry" DROP COLUMN "userId";
