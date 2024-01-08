-- AlterTable
CREATE SEQUENCE publishdate_id_seq;
ALTER TABLE "PublishDate" ALTER COLUMN "id" SET DEFAULT nextval('publishdate_id_seq');
ALTER SEQUENCE publishdate_id_seq OWNED BY "PublishDate"."id";
