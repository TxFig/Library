ALTER TABLE "Book" ADD COLUMN "publicId" TEXT;

-- Update existing columns with a public id
UPDATE "Book" SET "publicId" = generate_public_id();

-- Add default for future inserts
ALTER TABLE "Book" ALTER COLUMN "publicId" SET DEFAULT generate_public_id();

ALTER TABLE "Book" ALTER COLUMN "publicId" SET NOT NULL;
CREATE UNIQUE INDEX "Book_publicId_key" ON "Book"("publicId");
