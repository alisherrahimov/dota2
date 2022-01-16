/*
  Warnings:

  - You are about to drop the column `movies_id` on the `Tags` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Tags" DROP CONSTRAINT "Tags_movies_id_fkey";

-- AlterTable
ALTER TABLE "Tags" DROP COLUMN "movies_id";

-- CreateTable
CREATE TABLE "MovieAndTags" (
    "id" TEXT NOT NULL,
    "movies_id" TEXT NOT NULL,
    "tags_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MovieAndTags_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MovieAndTags" ADD CONSTRAINT "MovieAndTags_tags_id_fkey" FOREIGN KEY ("tags_id") REFERENCES "Tags"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovieAndTags" ADD CONSTRAINT "MovieAndTags_movies_id_fkey" FOREIGN KEY ("movies_id") REFERENCES "Movies"("id") ON DELETE SET NULL ON UPDATE CASCADE;
