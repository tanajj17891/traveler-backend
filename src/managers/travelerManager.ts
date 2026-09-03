import { PrismaClient } from "@prisma/client";
import {
  BadRequestError,
  ExtendedError,
  InternalServerError,
  NotFoundError,
} from "../Errors/Errors";
import {
  TravelerResponse,
  CreateTravelerPost,
  UpdateTravelerRequest,
} from "../models/travelerModels";

const prisma = new PrismaClient();

export class TravelerManager {
  async createTraveler(input: CreateTravelerPost): Promise<TravelerResponse> {
    try {
      const [trip, profile] = await Promise.all([
        prisma.trip.findUnique({
          where: {
            tripId: input.tripId,
          },
        }),

        prisma.profile.findUnique({
          where: {
            profileId: input.profileId,
          },
        }),
      ]);

      if (!trip) {
        throw new NotFoundError({
          description: "Trip not found",
        });
      }

      if (!profile) {
        throw new NotFoundError({
          description: "Profile not found",
        });
      }

      const existingTraveler = await prisma.travelers.findUnique({
        where: {
          tripId_profileId: {
            tripId: input.tripId,
            profileId: input.profileId,
          },
        },
      });

      if (existingTraveler) {
        throw new BadRequestError({
          description:
            "A traveler already exists for this profile on this trip",
        });
      }

      const travelers = await prisma.travelers.create({
        data: {
          tripId: input.tripId,
          profileId: input.profileId,
          email: input.email,
        },
      });

      return new TravelerResponse(travelers);
    } catch (e) {
      console.error("TRAVELER CREATE ERROR:", e);

      if (e instanceof ExtendedError) {
        throw e;
      }

      throw new InternalServerError({
        description: "Failed to add travelers",
      });
    }
  }

  async getTraveler(travelerId: string): Promise<TravelerResponse> {
    try {
      const travelers = await prisma.travelers.findUnique({
        where: {
          travelerId,
        },
      });

      if (!travelers) {
        throw new NotFoundError({
          description: "travelers not found",
        });
      }

      return new TravelerResponse(travelers);
    } catch (e) {
      if (e instanceof ExtendedError) {
        throw e;
      }

      throw new InternalServerError({
        description: "Failed to get travelers",
      });
    }
  }

  async getTravelersByTripId(tripId: string): Promise<TravelerResponse[]> {
    try {
      const travelers = await prisma.travelers.findMany({
        where: {
          tripId,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return travelers.map((travelers) => new TravelerResponse(travelers));
    } catch (e) {
      if (e instanceof ExtendedError) {
        throw e;
      }

      throw new InternalServerError({
        description: "Failed to get trip travelers",
      });
    }
  }

  async getTravelerByTripIdAndProfileId(
    tripId: string,
    profileId: string,
  ): Promise<TravelerResponse> {
    try {
      const travelers = await prisma.travelers.findUnique({
        where: {
          tripId_profileId: {
            tripId,
            profileId,
          },
        },
      });

      if (!travelers) {
        throw new NotFoundError({
          description: "travelers not found",
        });
      }

      return new TravelerResponse(travelers);
    } catch (e) {
      if (e instanceof ExtendedError) {
        throw e;
      }

      throw new InternalServerError({
        description: "Failed to get travelers",
      });
    }
  }

  async updateTravelers(
    travelerId: string,
    input: UpdateTravelerRequest,
  ): Promise<TravelerResponse> {
    try {
      const existingTraveler = await prisma.travelers.findUnique({
        where: {
          travelerId,
        },
      });

      if (!existingTraveler) {
        throw new NotFoundError({
          description: "travelers not found",
        });
      }

      const updatedTraveler = await prisma.travelers.update({
        where: {
          travelerId,
        },
        data: input,
      });

      return new TravelerResponse(updatedTraveler);
    } catch (e) {
      if (e instanceof ExtendedError) {
        throw e;
      }

      throw new InternalServerError({
        description: "Failed to update travelers",
      });
    }
  }

  async deleteTraveler(travelerId: string): Promise<{ message: string }> {
    try {
      const existingTraveler = await prisma.travelers.findUnique({
        where: {
          travelerId,
        },
      });

      if (!existingTraveler) {
        throw new NotFoundError({
          description: "travelers not found",
        });
      }

      await prisma.travelers.delete({
        where: {
          travelerId,
        },
      });

      return {
        message: "travelers deleted successfully",
      };
    } catch (e) {
      if (e instanceof ExtendedError) {
        throw e;
      }

      throw new InternalServerError({
        description: "Failed to delete travelers",
      });
    }
  }
}
