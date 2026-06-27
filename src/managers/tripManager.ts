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
  async getTrip(trip_id: string) {
    return prisma.trip.findUnique({
      where: { trip_id },
    });
  }

  async updateTrip(trip_id: string, input: UpdateTripRequest) {
    return prisma.trip.update({
      where: { trip_id },
      data: input,
    });
  }

  async deleteTrip(trip_id: string) {
    await prisma.trip.delete({
      where: { trip_id },
    });
    return { message: "Trip deleted successfully." };
  }
}
