/*
  Warnings:

  - Added the required column `name_key` to the `Tags` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Tags" ADD COLUMN     "name_key" TEXT NOT NULL;
