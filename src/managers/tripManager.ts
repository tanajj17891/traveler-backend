import { PrismaClient } from "@prisma/client";
import {
  InternalServerError,
  ExtendedError,
  NotFoundError,
} from "../Errors/Errors";
import { CreateTripRequest, UpdateTripRequest } from "../models/tripModels";

const prisma = new PrismaClient();

export class TripManager {
  async createTrip(input: CreateTripRequest) {
    try {
      const trip = await prisma.trip.create({
        data: input,
      });

      return trip;
    } catch (e) {
      console.error("TRIP ERROR:", e);

      if (e instanceof ExtendedError) throw e;

      throw new InternalServerError({
        description: "Failed to create trip",
      });
    }
  }

  async getTrip(tripId: string) {
    try {
      const trip = await prisma.trip.findUnique({
        where: { tripId },
      });

      if (!trip) {
        throw new NotFoundError({
          description: "Trip not found",
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
