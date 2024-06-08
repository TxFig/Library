-- CreateEnum
CREATE TYPE "ActivityType" AS ENUM ('BOOK_ADDED', 'BOOK_UPDATED', 'BOOK_DELETED', 'BOOK_BORROWED', 'USER_CREATED', 'USER_UPDATED', 'USER_DELETED');

-- CreateTable
CREATE TABLE "Activity" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,
    "type" "ActivityType" NOT NULL,
    "metadata" JSONB NOT NULL,

    CONSTRAINT "Activity_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
