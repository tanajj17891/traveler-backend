/*
  Warnings:

  - The `notes` column on the `Trip` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `destination` column on the `Trip` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Trip" DROP COLUMN "notes",
ADD COLUMN     "notes" JSONB[],
DROP COLUMN "destination",
ADD COLUMN     "destination" JSONB[];
