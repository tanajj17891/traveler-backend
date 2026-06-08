-- CreateEnum
CREATE TYPE "TravelStyle" AS ENUM ('BEACH_AND_SUN', 'ADVENTURE', 'CITY_BREAKS', 'FOOD_AND_DRINK', 'CULTURE_AND_ART', 'ECO_TRAVEL', 'BUSINESS', 'ROMANTIC', 'WINTER_SPORTS', 'PHOTOGRAPHY');

-- CreateEnum
CREATE TYPE "TravelPreference" AS ENUM ('SOLO_TRAVELER', 'TRAVELING_WITH_KIDS', 'BUDGET_CONSCIOUS');

-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "preferences" "TravelPreference"[],
ADD COLUMN     "travelStyle" "TravelStyle"[];
