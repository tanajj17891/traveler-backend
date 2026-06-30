import { PrismaClient } from "@prisma/client";
import {
  BadRequestError,
  InternalServerError,
  ExtendedError,
  NotFoundError,
} from "../Errors/Errors";
import {
  CreateTripPost,
  CreateTripRequest,
  UpdateTripRequest,
} from "../models/tripModels";

const prisma = new PrismaClient();

export class TripManager {
  async createTrip(input: CreateTripRequest) {
    return prisma.trip.create({
      data: input,
    });
  }
  async getTrip(tripId: string) {
    return prisma.trip.findUnique({
      where: { tripId },
    });
  }

  async updateTrip(tripId: string, input: UpdateTripRequest) {
    return prisma.trip.update({
      where: { tripId },
      data: input,
    });
  }

  async deleteTrip(tripId: string) {
    await prisma.trip.delete({
      where: { tripId },
    });
    return { message: "Trip deleted successfully." };
  }
}
