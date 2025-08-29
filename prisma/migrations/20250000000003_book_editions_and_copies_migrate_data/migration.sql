-- Create Book Editions
ALTER TABLE "BookEdition" ALTER COLUMN "publicId" SET DEFAULT generate_public_id();

INSERT INTO "BookEdition" ("bookId", "title", "subtitle", "pageCount", "isbn10", "isbn13", "languageId")
SELECT
    "id",
    "title",
    "subtitle",
    "number_of_pages",
    CASE WHEN LENGTH("isbn") = 10 THEN "isbn" ELSE "isbn10" END,
    CASE WHEN LENGTH("isbn") = 13 THEN "isbn" ELSE "isbn13" END,
    "languageId"
FROM "Book";

-- Migrate Publishers
INSERT INTO "_BookEditionToPublisher" ("A", "B")
SELECT edition.id, book_publisher."B"
FROM "_BookToPublisher" book_publisher
    JOIN "Book" book
        ON book.id = book_publisher."A"
    JOIN "BookEdition" edition
        ON edition."bookId" = book.id;

-- Migrate Book Collections
INSERT INTO "_BookCollectionToBookEdition" ("A", "B")
SELECT book_collection."B", edition.id
FROM "_BookToBookCollection" book_collection
    JOIN "Book" book
        ON book.id = book_collection."A"
    JOIN "BookEdition" edition
        ON edition."bookId" = book.id;

-- Migrate Publish Date
UPDATE "PublishDate" publish_date
SET "editionId" = edition.id
FROM "BookEdition" edition
WHERE edition.id = publish_date."bookId";

-- Migrate Images
UPDATE "Image" image
SET "editionId" = edition.id
FROM "BookEdition" edition
WHERE edition.id = image."bookId";

-- Migrate Ratings
UPDATE "UserBookRating" user_book_rating
SET "editionId" = edition.id
FROM "BookEdition" edition
WHERE edition.id = user_book_rating."bookId";

-- Migrate Reading States
UPDATE "UserBookReadingState" user_book_reading_state
SET "editionId" = edition.id
FROM "BookEdition" edition
WHERE edition.id = user_book_reading_state."bookId";

-- Create Book Copies
ALTER TABLE "BookCopy" ALTER COLUMN "publicId" SET DEFAULT generate_public_id();
