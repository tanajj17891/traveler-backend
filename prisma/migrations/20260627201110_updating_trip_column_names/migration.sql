/*
  Warnings:

  - The primary key for the `Trip` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `created_at` on the `Trip` table. All the data in the column will be lost.
  - You are about to drop the column `profile_id` on the `Trip` table. All the data in the column will be lost.
  - You are about to drop the column `trip_id` on the `Trip` table. All the data in the column will be lost.
  - You are about to drop the column `trip_name` on the `Trip` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `Trip` table. All the data in the column will be lost.
  - Added the required column `profileId` to the `Trip` table without a default value. This is not possible if the table is not empty.
  - The required column `tripId` was added to the `Trip` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `tripName` to the `Trip` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Trip` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Trip" DROP CONSTRAINT "Trip_profile_id_fkey";

-- AlterTable
ALTER TABLE "Trip" DROP CONSTRAINT "Trip_pkey",
DROP COLUMN "created_at",
DROP COLUMN "profile_id",
DROP COLUMN "trip_id",
DROP COLUMN "trip_name",
DROP COLUMN "updated_at",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "profileId" TEXT NOT NULL,
ADD COLUMN     "tripId" TEXT NOT NULL,
ADD COLUMN     "tripName" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD CONSTRAINT "Trip_pkey" PRIMARY KEY ("tripId");

-- AddForeignKey
ALTER TABLE "Trip" ADD CONSTRAINT "Trip_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("profileId") ON DELETE RESTRICT ON UPDATE CASCADE;
