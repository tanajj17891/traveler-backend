import { PrismaClient } from "@prisma/client";
import {
  ExtendedError,
  InternalServerError,
  NotFoundError,
} from "../Errors/Errors";
import {
  ActivityResponse,
  CreateActivityPost,
  UpdateActivityRequest,
} from "../models/activityModels";
import { UpdateDestinationBody } from "../models/destinationsModels";

const prisma = new PrismaClient();

export class ActivityManager {
  async createActivity(input: CreateActivityPost): Promise<ActivityResponse> {
    try {
      const destination = await prisma.destination.findUnique({
        where: {
          destinationId: input.destinationId,
        },
      });

      if (!destination) {
        throw new NotFoundError({
          description: "Destination not found",
        });
      }

      const activity = await prisma.activity.create({
        data: {
          destinationId: input.destinationId,
          day: input.day,
          startTime: input.startTime,
          activityType: input.activityType,
          description: input.description,
          notes: input.notes,
        },
      });

      return new ActivityResponse({
        ...activity,
        notes: activity.notes ?? undefined,
      });
    } catch (e) {
      console.error("ACTIVITY ERROR:", e);

      if (e instanceof ExtendedError) {
        throw e;
      }

      throw new InternalServerError({
        description: "Failed to create activity",
      });
    }
  }

  async getActivity(activityId: string): Promise<ActivityResponse> {
    try {
      const activity = await prisma.activity.findUnique({
        where: {
          activityId,
        },
      });

      if (!activity) {
        throw new NotFoundError({
          description: "Activity not found",
        });
      }

      return new ActivityResponse({
        ...activity,
        notes: activity.notes ?? undefined,
      });
    } catch (e) {
      console.error("ACTIVITY ERROR:", e);

      if (e instanceof ExtendedError) {
        throw e;
      }

      throw new InternalServerError({
        description: "Failed to get activity",
      });
    }
  }

  async getActivitiesByDestinationId(
    destinationId: string,
  ): Promise<ActivityResponse[]> {
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

      const activities = await prisma.activity.findMany({
        where: {
          destinationId,
        },
        orderBy: [
          {
            day: "asc",
          },
          {
            startTime: "asc",
          },
        ],
      });

      return activities.map(
        (activity) =>
          new ActivityResponse({
            ...activity,
            notes: activity.notes ?? undefined,
          }),
      );
    } catch (e) {
      console.error("ACTIVITY ERROR:", e);

      if (e instanceof ExtendedError) {
        throw e;
      }

      throw new InternalServerError({
        description: "Failed to get destination activities",
      });
    }
  }

  async getActivitiesByDestinationAndDay(
    destinationId: string,
    day: number,
  ): Promise<ActivityResponse[]> {
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

      const activities = await prisma.activity.findMany({
        where: {
          destinationId,
          day,
        },
        orderBy: {
          startTime: "asc",
        },
      });

      return activities.map(
        (activity) =>
          new ActivityResponse({
            ...activity,
            notes: activity.notes ?? undefined,
          }),
      );
    } catch (e) {
      console.error("ACTIVITY ERROR:", e);

      if (e instanceof ExtendedError) {
        throw e;
      }

      throw new InternalServerError({
        description: "Failed to get activities for this day",
      });
    }
  }

  async updateActivity(
    activityId: string,
    input: UpdateActivityRequest,
  ): Promise<ActivityResponse> {
    try {
      const existingActivity = await prisma.activity.findUnique({
        where: {
          activityId,
        },
      });

      if (!existingActivity) {
        throw new NotFoundError({
          description: "Activity not found",
        });
      }

      const updatedActivity = await prisma.activity.update({
        where: {
          activityId,
        },
        data: {
          day: input.day,
          startTime: input.startTime,
          activityType: input.activityType,
          description: input.description,
          notes: input.notes,
        },
      });

      return new ActivityResponse(updatedActivity);
    } catch (e) {
      console.error("ACTIVITY ERROR:", e);

      if (e instanceof ExtendedError) {
        throw e;
      }

      throw new InternalServerError({
        description: "Failed to update activity",
      });
    }
  }

  async deleteActivity(activityId: string): Promise<{ message: string }> {
    try {
      const existingActivity = await prisma.activity.findUnique({
        where: {
          activityId,
        },
      });

      if (!existingActivity) {
        throw new NotFoundError({
          description: "Activity not found",
        });
      }

      await prisma.activity.delete({
        where: {
          activityId,
        },
      });

      return {
        message: "Activity deleted successfully",
      };
    } catch (e) {
      console.error("ACTIVITY ERROR:", e);

      if (e instanceof ExtendedError) {
        throw e;
      }

      throw new InternalServerError({
        description: "Failed to delete activity",
      });
    }
  }
}
