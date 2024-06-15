/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `BookCollection` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "BookCollection_name_key" ON "BookCollection"("name");
