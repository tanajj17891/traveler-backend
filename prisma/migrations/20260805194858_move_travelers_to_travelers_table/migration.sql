/*
  Warnings:

  - You are about to drop the column `travelers` on the `Trip` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Trip" DROP COLUMN "travelers";

-- CreateTable
CREATE TABLE "Travelers" (
    "travelerId" TEXT NOT NULL,
    "tripId" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "Travelers_pkey" PRIMARY KEY ("travelerId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Travelers_tripId_profileId_key" ON "Travelers"("tripId", "profileId");

-- AddForeignKey
ALTER TABLE "Travelers" ADD CONSTRAINT "Travelers_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "Trip"("tripId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Travelers" ADD CONSTRAINT "Travelers_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("profileId") ON DELETE CASCADE ON UPDATE CASCADE;
