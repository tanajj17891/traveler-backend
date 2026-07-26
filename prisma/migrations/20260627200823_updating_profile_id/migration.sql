/*
  Warnings:

  - The values [PAST] on the enum `TripStatus` will be removed. If these variants are still used in the database, this will fail.
  - The primary key for the `Profile` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Profile` table. All the data in the column will be lost.
  - The primary key for the `Trip` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `cognitoSub` on the `Trip` table. All the data in the column will be lost.
  - You are about to drop the column `country` on the `Trip` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Trip` table. All the data in the column will be lost.
  - You are about to drop the column `endDate` on the `Trip` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `Trip` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `Trip` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Trip` table. All the data in the column will be lost.
  - The `destination` column on the `Trip` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `travelers` column on the `Trip` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `budget` column on the `Trip` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The required column `profileId` was added to the `Profile` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `profile_id` to the `Trip` table without a default value. This is not possible if the table is not empty.
  - The required column `trip_id` was added to the `Trip` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `trip_name` to the `Trip` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Trip` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "TripStatus_new" AS ENUM ('PLANNING', 'UPCOMING', 'IN_PROGRESS', 'COMPLETED');
ALTER TABLE "Trip" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Trip" ALTER COLUMN "status" TYPE "TripStatus_new" USING ("status"::text::"TripStatus_new");
ALTER TYPE "TripStatus" RENAME TO "TripStatus_old";
ALTER TYPE "TripStatus_new" RENAME TO "TripStatus";
DROP TYPE "TripStatus_old";
ALTER TABLE "Trip" ALTER COLUMN "status" SET DEFAULT 'PLANNING';
COMMIT;

-- AlterTable
ALTER TABLE "Profile" DROP CONSTRAINT "Profile_pkey",
DROP COLUMN "id",
ADD COLUMN     "profileId" TEXT NOT NULL,
ADD CONSTRAINT "Profile_pkey" PRIMARY KEY ("profileId");

-- AlterTable
ALTER TABLE "Trip" DROP CONSTRAINT "Trip_pkey",
DROP COLUMN "cognitoSub",
DROP COLUMN "country",
DROP COLUMN "createdAt",
DROP COLUMN "endDate",
DROP COLUMN "id",
DROP COLUMN "startDate",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "notes" TEXT[],
ADD COLUMN     "profile_id" TEXT NOT NULL,
ADD COLUMN     "trip_id" TEXT NOT NULL,
ADD COLUMN     "trip_name" TEXT NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
DROP COLUMN "destination",
ADD COLUMN     "destination" TEXT[],
DROP COLUMN "travelers",
ADD COLUMN     "travelers" TEXT[],
DROP COLUMN "budget",
ADD COLUMN     "budget" JSONB,
ALTER COLUMN "status" SET DEFAULT 'PLANNING',
ADD CONSTRAINT "Trip_pkey" PRIMARY KEY ("trip_id");

-- AddForeignKey
ALTER TABLE "Trip" ADD CONSTRAINT "Trip_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "Profile"("profileId") ON DELETE RESTRICT ON UPDATE CASCADE;
