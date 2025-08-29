-- CreateEnum
CREATE TYPE "CopyStatus" AS ENUM ('available', 'on_loan', 'unavailable');

-- CreateEnum
CREATE TYPE "CopyLoanStatus" AS ENUM ('reserved', 'active', 'returned', 'cancelled');

-- CreateEnum
CREATE TYPE "CopyRequestStatus" AS ENUM ('pending', 'accepted', 'rejected', 'cancelled');

-- DropForeignKey
ALTER TABLE "BookCopy" DROP CONSTRAINT "BookCopy_locationId_fkey";

-- DropForeignKey
ALTER TABLE "BookCopy" DROP CONSTRAINT "BookCopy_ownerId_fkey";

-- AlterTable
ALTER TABLE "BookCopy" ADD COLUMN     "status" "CopyStatus" NOT NULL DEFAULT 'available';

-- CreateTable
CREATE TABLE "CopyLoan" (
    "id" SERIAL NOT NULL,
    "publicId" TEXT NOT NULL DEFAULT generate_public_id(),
    "copyId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "requestId" INTEGER NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "duration" INTEGER NOT NULL,
    "status" "CopyLoanStatus" NOT NULL,

    CONSTRAINT "CopyLoan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CopyRequest" (
    "id" SERIAL NOT NULL,
    "publicId" TEXT NOT NULL DEFAULT generate_public_id(),
    "copyId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "duration" INTEGER NOT NULL,
    "status" "CopyRequestStatus" NOT NULL DEFAULT 'pending',
    "resolvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CopyRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CopyLoan_publicId_key" ON "CopyLoan"("publicId");

-- CreateIndex
CREATE UNIQUE INDEX "CopyLoan_requestId_key" ON "CopyLoan"("requestId");

-- CreateIndex
CREATE UNIQUE INDEX "CopyRequest_publicId_key" ON "CopyRequest"("publicId");

-- AddForeignKey
ALTER TABLE "BookCopy" ADD CONSTRAINT "BookCopy_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookCopy" ADD CONSTRAINT "BookCopy_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CopyLoan" ADD CONSTRAINT "CopyLoan_copyId_fkey" FOREIGN KEY ("copyId") REFERENCES "BookCopy"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CopyLoan" ADD CONSTRAINT "CopyLoan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CopyLoan" ADD CONSTRAINT "CopyLoan_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "CopyRequest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CopyRequest" ADD CONSTRAINT "CopyRequest_copyId_fkey" FOREIGN KEY ("copyId") REFERENCES "BookCopy"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CopyRequest" ADD CONSTRAINT "CopyRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
