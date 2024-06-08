-- DropForeignKey
ALTER TABLE "EmailConfirmationRequest" DROP CONSTRAINT "EmailConfirmationRequest_userId_fkey";

-- AddForeignKey
ALTER TABLE "EmailConfirmationRequest" ADD CONSTRAINT "EmailConfirmationRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
