/*
  Warnings:

  - The primary key for the `Book` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Book` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "_AuthorToBook" DROP CONSTRAINT "_AuthorToBook_B_fkey";

-- DropForeignKey
ALTER TABLE "_BookToPublisher" DROP CONSTRAINT "_BookToPublisher_A_fkey";

-- DropForeignKey
ALTER TABLE "_BookToSubject" DROP CONSTRAINT "_BookToSubject_A_fkey";

-- AlterTable
ALTER TABLE "Book" DROP CONSTRAINT "Book_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "Book_pkey" PRIMARY KEY ("isbn");

-- AddForeignKey
ALTER TABLE "_BookToPublisher" ADD CONSTRAINT "_BookToPublisher_A_fkey" FOREIGN KEY ("A") REFERENCES "Book"("isbn") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BookToSubject" ADD CONSTRAINT "_BookToSubject_A_fkey" FOREIGN KEY ("A") REFERENCES "Book"("isbn") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AuthorToBook" ADD CONSTRAINT "_AuthorToBook_B_fkey" FOREIGN KEY ("B") REFERENCES "Book"("isbn") ON DELETE CASCADE ON UPDATE CASCADE;
