/*
  Warnings:

  - You are about to drop the column `budget` on the `Trip` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Trip" DROP COLUMN "budget";

-- CreateTable
CREATE TABLE "Budgets" (
    "budgetId" TEXT NOT NULL,
    "tripId" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,
    "flights" DOUBLE PRECISION NOT NULL,
    "accommodation" DOUBLE PRECISION NOT NULL,
    "food" DOUBLE PRECISION NOT NULL,
    "activities" DOUBLE PRECISION NOT NULL,
    "misc" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Budgets_pkey" PRIMARY KEY ("budgetId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Budgets_tripId_profileId_key" ON "Budgets"("tripId", "profileId");

-- AddForeignKey
ALTER TABLE "Budgets" ADD CONSTRAINT "Budgets_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "Trip"("tripId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Budgets" ADD CONSTRAINT "Budgets_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("profileId") ON DELETE CASCADE ON UPDATE CASCADE;
