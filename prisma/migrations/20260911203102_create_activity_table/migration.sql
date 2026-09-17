-- CreateEnum
CREATE TYPE "ActivityType" AS ENUM ('flight', 'hotel check in', 'hotel check out', 'food & drink', 'activity', 'other');

-- CreateTable
CREATE TABLE "activity" (
    "activityId" TEXT NOT NULL,
    "destinationId" TEXT NOT NULL,
    "day" INTEGER NOT NULL,
    "startTime" TEXT NOT NULL,
    "activityType" "ActivityType" NOT NULL,
    "description" TEXT NOT NULL,
    "notes" TEXT,

    CONSTRAINT "activity_pkey" PRIMARY KEY ("activityId")
);

-- AddForeignKey
ALTER TABLE "activity" ADD CONSTRAINT "activity_destinationId_fkey" FOREIGN KEY ("destinationId") REFERENCES "destinations"("destinationId") ON DELETE CASCADE ON UPDATE CASCADE;
