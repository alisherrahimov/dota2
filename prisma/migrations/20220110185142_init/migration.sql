-- AlterTable
ALTER TABLE "Movies" ADD COLUMN     "count" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "stars" SET DEFAULT 0;
