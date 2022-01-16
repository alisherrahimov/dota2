-- DropForeignKey
ALTER TABLE "Tags" DROP CONSTRAINT "Tags_movies_id_fkey";

-- AlterTable
ALTER TABLE "Tags" ALTER COLUMN "movies_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Tags" ADD CONSTRAINT "Tags_movies_id_fkey" FOREIGN KEY ("movies_id") REFERENCES "Movies"("id") ON DELETE SET NULL ON UPDATE CASCADE;
