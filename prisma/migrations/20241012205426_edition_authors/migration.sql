-- CreateTable
CREATE TABLE "_AuthorToBookEdition" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_AuthorToBookEdition_AB_unique" ON "_AuthorToBookEdition"("A", "B");

-- CreateIndex
CREATE INDEX "_AuthorToBookEdition_B_index" ON "_AuthorToBookEdition"("B");

-- AddForeignKey
ALTER TABLE "_AuthorToBookEdition" ADD CONSTRAINT "_AuthorToBookEdition_A_fkey" FOREIGN KEY ("A") REFERENCES "Author"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AuthorToBookEdition" ADD CONSTRAINT "_AuthorToBookEdition_B_fkey" FOREIGN KEY ("B") REFERENCES "BookEdition"("id") ON DELETE CASCADE ON UPDATE CASCADE;
