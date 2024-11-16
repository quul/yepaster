-- CreateEnum
CREATE TYPE "PasteType" AS ENUM ('TEXT', 'FILE');

-- CreateTable
CREATE TABLE "Paste" (
    "id" SERIAL NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,
    "author" TEXT NOT NULL,
    "authorId" INTEGER NOT NULL,
    "key" TEXT NOT NULL,
    "type" "PasteType" NOT NULL,
    "mime" TEXT NOT NULL,
    "ip" TEXT NOT NULL,
    "expireAt" TIMESTAMP(3) NOT NULL,
    "accessCode" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "content" TEXT NOT NULL,

    CONSTRAINT "Paste_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Paste_id_key" ON "Paste"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Paste_key_key" ON "Paste"("key");
