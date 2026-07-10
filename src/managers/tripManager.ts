import { PrismaClient } from "@prisma/client";
import {
  InternalServerError,
  ExtendedError,
  NotFoundError,
  BadRequestError,
} from "../Errors/Errors";
import { CreateTripRequest, UpdateTripRequest } from "../models/tripModels";

const prisma = new PrismaClient();

export class TripManager {
  async createTrip(input: CreateTripRequest) {
    try {
      console.log("Raw traveler emails:", input.travelers);

      if (!Array.isArray(input.travelers)) {
        /* Checks that the traveler data is a valid list (array) of text and reejects the request if any email is completely blank. */
        throw new BadRequestError({
          description: "Travelers must be an array of email addresses",
        });
      }

      const hasEmptyTraveler = input.travelers.some(
        (email) => typeof email !== "string" || email.trim().length === 0,
      );

      if (hasEmptyTraveler) {
        throw new BadRequestError({
          description: "Traveler email cannot be empty",
        });
      }

      const normalizedTravelerEmails = [
        ...new Set(input.travelers.map((email) => email.trim().toLowerCase())),
      ];

      console.log("Normalized traveler emails:", normalizedTravelerEmails);

      const travelerProfiles = // Takes the cleaned list of emails and searches the database (prisma.profile) to see if these users already exist.
        normalizedTravelerEmails.length > 0
          ? await prisma.profile.findMany({
              where: {
                OR: normalizedTravelerEmails.map((email) => ({
                  email: {
                    equals: email,
                    mode: "insensitive",
                  },
                })),
              },
              select: {
                profileId: true,
                email: true,
              },
            })
          : [];

      console.log("Traveler profiles found:", travelerProfiles);

      const foundEmails = new Set(
        travelerProfiles.map(
          (
            profile, // It creates a clean checklist of lowercase emails found in the database to easily spot which ones are missing.
          ) => profile.email.trim().toLowerCase(),
        ),
      );

      const missingEmails = normalizedTravelerEmails.filter(
        //normalization means converting data into a standard, uniform format so it can be compared fairly.
        (email) => !foundEmails.has(email),
      );

      if (missingEmails.length > 0) {
        throw new BadRequestError({
          description: `These traveler emails do not have profiles: ${missingEmails.join(
            //If any email on the list does not have an existing profile,
            // it instantly stops and throws a BadRequestError listing the missing emails.
            ", ",
          )}`,
        });
      }

      const trip = await prisma.trip.create({
        data: {
          ...input,
          travelers: normalizedTravelerEmails,
        },
      });

      return trip;
    } catch (e) {
      console.error("TRIP ERROR:", e);

      if (e instanceof ExtendedError) {
        throw e;
      }

      throw new InternalServerError({
        description: "Failed to create trip",
      });
    }
  }
  async getTrip(tripId: string) {
    try {
      if (!tripId || tripId === "undefined" || tripId === "null") {
        throw new BadRequestError({
          description: "A valid trip ID is required",
        });
      }

      const trip = await prisma.trip.findUnique({
        where: { tripId },
      });

      if (!trip) {
        throw new NotFoundError({
          description: `Trip not found for ID: ${tripId}`,
        });
      }

      return trip;
    } catch (e) {
      console.error("TRIP ERROR:", e);

      if (e instanceof ExtendedError) throw e;

      throw new InternalServerError({
        description: "Failed to get trip",
      });
    }
  }

  async getTripsByProfileId(profileId: string) {
    try {
      const trips = await prisma.trip.findMany({
        where: { profileId },
        orderBy: { createdAt: "desc" },
      });

      return trips;
    } catch (e) {
      console.error("TRIP ERROR:", e);

      if (e instanceof ExtendedError) throw e;

      throw new InternalServerError({
        description: "Failed to get trips",
      });
    }
  }

  async updateTrip(tripId: string, input: UpdateTripRequest) {
    try {
      const trip = await prisma.trip.findUnique({
        where: { tripId },
      });

      if (!trip) {
        throw new NotFoundError({
          description: "Trip not found",
        });
      }

      const updated = await prisma.trip.update({
        where: { tripId },
        data: input,
      });

      return updated;
    } catch (e) {
      console.error("TRIP ERROR:", e);

      if (e instanceof ExtendedError) throw e;

      throw new InternalServerError({
        description: "Failed to update trip",
      });
    }
  }

  async deleteTrip(tripId: string) {
    try {
      const trip = await prisma.trip.findUnique({
        where: { tripId },
      });

      if (!trip) {
        throw new NotFoundError({
          description: "Trip not found",
        });
      }

      await prisma.trip.delete({
        where: { tripId },
      });

      return { message: "Trip deleted successfully." };
    } catch (e) {
      console.error("TRIP ERROR:", e);

      if (e instanceof ExtendedError) throw e;

      throw new InternalServerError({
        description: "Failed to delete trip",
      });
    }
  }
}
