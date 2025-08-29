-- DropForeignKey
ALTER TABLE "BookCopy" DROP CONSTRAINT "BookCopy_editionId_fkey";

-- AddForeignKey
ALTER TABLE "BookCopy" ADD CONSTRAINT "BookCopy_editionId_fkey" FOREIGN KEY ("editionId") REFERENCES "BookEdition"("id") ON DELETE CASCADE ON UPDATE CASCADE;
