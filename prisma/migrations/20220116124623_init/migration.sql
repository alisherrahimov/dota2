-- DropForeignKey
ALTER TABLE "Tags" DROP CONSTRAINT "Tags_movies_id_fkey";

-- AddForeignKey
ALTER TABLE "Tags" ADD CONSTRAINT "Tags_movies_id_fkey" FOREIGN KEY ("movies_id") REFERENCES "Movies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
