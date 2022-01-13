-- CreateTable
CREATE TABLE "Movies" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "stars" DOUBLE PRECISION NOT NULL,
    "movie_time" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "hero" TEXT NOT NULL,
    "rampage" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Movies_pkey" PRIMARY KEY ("id")
);
