-- CreateEnum
CREATE TYPE "TripStatus" AS ENUM ('UPCOMING', 'PLANNING', 'PAST');

-- CreateTable
CREATE TABLE "Trip" (
    "id" TEXT NOT NULL,
    "cognitoSub" TEXT NOT NULL,
    "destination" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "travelers" INTEGER,
    "budget" DOUBLE PRECISION,
    "status" "TripStatus" NOT NULL DEFAULT 'UPCOMING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Trip_pkey" PRIMARY KEY ("id")
);
