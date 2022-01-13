/*
  Warnings:

  - You are about to drop the column `count` on the `Movies` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Movies" DROP COLUMN "count",
ADD COLUMN     "view" INTEGER NOT NULL DEFAULT 0;
