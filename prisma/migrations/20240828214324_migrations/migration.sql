-- CreateTable
CREATE TABLE "Migration" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "hasDataMigration" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Migration_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Migration_name_key" ON "Migration"("name");
