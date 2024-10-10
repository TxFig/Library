/*
  Warnings:

  - A unique constraint covering the columns `[editionId]` on the table `PublishDate` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Image" ADD COLUMN     "bookEditionId" INTEGER;

-- AlterTable
ALTER TABLE "PublishDate" ADD COLUMN     "editionId" INTEGER;

-- AlterTable
ALTER TABLE "UserBookRating" ADD COLUMN     "editionId" INTEGER;

-- AlterTable
ALTER TABLE "UserBookReadingState" ADD COLUMN     "editionId" INTEGER;

-- CreateTable
CREATE TABLE "BookEdition" (
    "id" SERIAL NOT NULL,
    "bookId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "numberOfPages" INTEGER,
    "isbn10" TEXT,
    "isbn13" TEXT,
    "languageId" INTEGER,

    CONSTRAINT "BookEdition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookCopy" (
    "id" SERIAL NOT NULL,
    "editionId" INTEGER NOT NULL,
    "locationId" INTEGER NOT NULL,

    CONSTRAINT "BookCopy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_BookEditionToPublisher" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_BookCollectionToBookEdition" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "BookEdition_isbn10_key" ON "BookEdition"("isbn10");

-- CreateIndex
CREATE UNIQUE INDEX "BookEdition_isbn13_key" ON "BookEdition"("isbn13");

-- CreateIndex
CREATE UNIQUE INDEX "_BookEditionToPublisher_AB_unique" ON "_BookEditionToPublisher"("A", "B");

-- CreateIndex
CREATE INDEX "_BookEditionToPublisher_B_index" ON "_BookEditionToPublisher"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_BookCollectionToBookEdition_AB_unique" ON "_BookCollectionToBookEdition"("A", "B");

-- CreateIndex
CREATE INDEX "_BookCollectionToBookEdition_B_index" ON "_BookCollectionToBookEdition"("B");

-- CreateIndex
CREATE UNIQUE INDEX "PublishDate_editionId_key" ON "PublishDate"("editionId");

-- AddForeignKey
ALTER TABLE "BookEdition" ADD CONSTRAINT "BookEdition_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookEdition" ADD CONSTRAINT "BookEdition_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "Language"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookCopy" ADD CONSTRAINT "BookCopy_editionId_fkey" FOREIGN KEY ("editionId") REFERENCES "BookEdition"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookCopy" ADD CONSTRAINT "BookCopy_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_bookEditionId_fkey" FOREIGN KEY ("bookEditionId") REFERENCES "BookEdition"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PublishDate" ADD CONSTRAINT "PublishDate_editionId_fkey" FOREIGN KEY ("editionId") REFERENCES "BookEdition"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserBookRating" ADD CONSTRAINT "UserBookRating_editionId_fkey" FOREIGN KEY ("editionId") REFERENCES "BookEdition"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserBookReadingState" ADD CONSTRAINT "UserBookReadingState_editionId_fkey" FOREIGN KEY ("editionId") REFERENCES "BookEdition"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BookEditionToPublisher" ADD CONSTRAINT "_BookEditionToPublisher_A_fkey" FOREIGN KEY ("A") REFERENCES "BookEdition"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BookEditionToPublisher" ADD CONSTRAINT "_BookEditionToPublisher_B_fkey" FOREIGN KEY ("B") REFERENCES "Publisher"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BookCollectionToBookEdition" ADD CONSTRAINT "_BookCollectionToBookEdition_A_fkey" FOREIGN KEY ("A") REFERENCES "BookCollection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BookCollectionToBookEdition" ADD CONSTRAINT "_BookCollectionToBookEdition_B_fkey" FOREIGN KEY ("B") REFERENCES "BookEdition"("id") ON DELETE CASCADE ON UPDATE CASCADE;
