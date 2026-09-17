import { PrismaClient } from "@prisma/client";
import {
  ExtendedError,
  InternalServerError,
  NotFoundError,
} from "../Errors/Errors";
import {
  CreateDestinationPost,
  DestinationResponse,
  UpdateDestinationRequest,
} from "../models/destinationsModels";

const prisma = new PrismaClient();

export class DestinationManager {
  async createDestination(
    input: CreateDestinationPost,
  ): Promise<DestinationResponse> {
    try {
      const trip = await prisma.trip.findUnique({
        where: {
          tripId: input.tripId,
        },
      });

      if (!trip) {
        throw new NotFoundError({
          description: "Trip not found",
        });
      }

      const destination = await prisma.destination.create({
        data: {
          tripId: input.tripId,
          name: input.name,
          latitude: input.latitude,
          longitude: input.longitude,
          arrivalDate: input.arrivalDate,
          leaveDate: input.leaveDate,
        },
      });

      return new DestinationResponse(destination);
    } catch (e) {
      console.error("DESTINATION ERROR:", e);

      if (e instanceof ExtendedError) {
        throw e;
      }

      throw new InternalServerError({
        description: "Failed to create destination",
      });
    }
  }

  async getDestination(destinationId: string): Promise<DestinationResponse> {
    try {
      const destination = await prisma.destination.findUnique({
        where: {
          destinationId,
        },
      });

      if (!destination) {
        throw new NotFoundError({
          description: "Destination not found",
        });
      }

      return new DestinationResponse(destination);
    } catch (e) {
      console.error("DESTINATION ERROR:", e);

      if (e instanceof ExtendedError) {
        throw e;
      }

      throw new InternalServerError({
        description: "Failed to get destination",
      });
    }
  }

  async getDestinationsByTripId(
    tripId: string,
  ): Promise<DestinationResponse[]> {
    try {
      const destinations = await prisma.destination.findMany({
        where: {
          tripId,
        },
        orderBy: {
          createdAt: "asc",
        },
      });

      return destinations.map(
        (destination) => new DestinationResponse(destination),
      );
    } catch (e) {
      console.error("DESTINATION ERROR:", e);

      if (e instanceof ExtendedError) {
        throw e;
      }

      throw new InternalServerError({
        description: "Failed to get trip destinations",
      });
    }
  }

  async updateDestination(
    destinationId: string,
    input: UpdateDestinationRequest,
  ): Promise<DestinationResponse> {
    try {
      const existingDestination = await prisma.destination.findUnique({
        where: {
          destinationId,
        },
      });

      if (!existingDestination) {
        throw new NotFoundError({
          description: "Destination not found",
        });
      }

      const updatedDestination = await prisma.destination.update({
        where: {
          destinationId,
        },
        data: input,
      });

      return new DestinationResponse(updatedDestination);
    } catch (e) {
      console.error("DESTINATION ERROR:", e);

      if (e instanceof ExtendedError) {
        throw e;
      }

      throw new InternalServerError({
        description: "Failed to update destination",
      });
    }
  }

  async deleteDestination(destinationId: string): Promise<{ message: string }> {
    try {
      const existingDestination = await prisma.destination.findUnique({
        where: {
          destinationId,
        },
      });

      if (!existingDestination) {
        throw new NotFoundError({
          description: "Destination not found",
        });
      }

      await prisma.destination.delete({
        where: {
          destinationId,
        },
      });

      return {
        message: "Destination deleted successfully",
      };
    } catch (e) {
      console.error("DESTINATION ERROR:", e);

      if (e instanceof ExtendedError) {
        throw e;
      }

      throw new InternalServerError({
        description: "Failed to delete destination",
      });
    }
  }
}
