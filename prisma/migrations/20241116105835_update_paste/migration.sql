/*
  Warnings:

  - Made the column `expireAt` on table `Paste` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Paste" ALTER COLUMN "expireAt" SET NOT NULL;
