-- CreateTable
CREATE TABLE "BookCollection" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "ownerId" INTEGER NOT NULL,

    CONSTRAINT "BookCollection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_BookToBookCollection" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_BookToBookCollection_AB_unique" ON "_BookToBookCollection"("A", "B");

-- CreateIndex
CREATE INDEX "_BookToBookCollection_B_index" ON "_BookToBookCollection"("B");

-- AddForeignKey
ALTER TABLE "BookCollection" ADD CONSTRAINT "BookCollection_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BookToBookCollection" ADD CONSTRAINT "_BookToBookCollection_A_fkey" FOREIGN KEY ("A") REFERENCES "Book"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BookToBookCollection" ADD CONSTRAINT "_BookToBookCollection_B_fkey" FOREIGN KEY ("B") REFERENCES "BookCollection"("id") ON DELETE CASCADE ON UPDATE CASCADE;
