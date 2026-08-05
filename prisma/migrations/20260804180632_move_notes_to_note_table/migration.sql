/*
  Warnings:

  - You are about to drop the column `notes` on the `Trip` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Trip" DROP COLUMN "notes";

-- CreateTable
CREATE TABLE "notes" (
    "noteId" TEXT NOT NULL,
    "tripId" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "text" TEXT NOT NULL,

    CONSTRAINT "notes_pkey" PRIMARY KEY ("noteId")
);

-- CreateIndex
CREATE UNIQUE INDEX "notes_tripId_profileId_key" ON "notes"("tripId", "profileId");

-- AddForeignKey
ALTER TABLE "notes" ADD CONSTRAINT "notes_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "Trip"("tripId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notes" ADD CONSTRAINT "notes_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("profileId") ON DELETE CASCADE ON UPDATE CASCADE;
