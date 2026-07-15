import { PrismaClient } from "@prisma/client";
import {
  InternalServerError,
  ExtendedError,
  NotFoundError,
  BadRequestError,
} from "../Errors/Errors";
import {
  Budget,
  CreateTripPost,
  CreateTripRequest,
  Destination,
  TripResponse,
  UpdateTripRequest,
} from "../models/tripModels";

const prisma = new PrismaClient();

export class TripManager {
  async createTrip(input: CreateTripPost): Promise<TripResponse> {
    try {
      let travelerProfileIds: string[] = [];

      if (input.travelers && input.travelers.length > 0) {
        const travelerEmailAndProfileId = await prisma.profile.findMany({
          where: {
            OR: input.travelers.map((email) => ({
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
        });
        travelerEmailAndProfileId.forEach((emailAndProfileId) => {
          travelerProfileIds.push(emailAndProfileId.profileId);
        });
      }

      if (travelerProfileIds.length !== input?.travelers?.length) {
        throw new BadRequestError({
          description:
            "one or multiple emails are not associated with a profile",
          body: input.travelers,
        });
      }

      const trip = await prisma.trip.create({
        data: {
          ...(input as any),
          travelers: travelerProfileIds,
        },
      });

      return this.mapTripFromPrisma(trip);
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
        data: input as any,
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

  mapTripFromPrisma(trip: any): TripResponse {
    return new TripResponse({
      ...trip,
      destination: Array.isArray(trip.destination)
        ? trip.destination.map(
            (item: any) => new Destination(item as Partial<Destination>),
          )
        : [],
      budget: trip.budget ? new Budget(trip.budget as Partial<Budget>) : null,
      notes: Array.isArray(trip.notes)
        ? trip.notes.map((note: any) => String(note))
        : [],
    });
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
