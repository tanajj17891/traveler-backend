import {
  Body,
  Delete,
  Get,
  JsonController,
  Param,
  Post,
  Put,
  UseBefore,
} from "routing-controllers";
import { isUUID, validateOrReject } from "class-validator";

import { ActivityManager } from "../managers/activityManager";

import {
  CreateActivityPost,
  CreateActivityRequest,
  UpdateActivityBody,
  UpdateActivityRequest,
  ActivityResponse,
} from "../models/activityModels";

import {
  BadRequestError,
  ExtendedError,
  InternalServerError,
} from "../Errors/Errors";

import { AuthMiddleware } from "../middleware/authMiddleware";

const activityManager = new ActivityManager();

@JsonController("/activities")
@UseBefore(AuthMiddleware)
export class ActivityController {
  @Post()
  async createActivity(
    @Body() body: CreateActivityRequest,
  ): Promise<ActivityResponse> {
    const request = new CreateActivityPost(body);

    try {
      await validateOrReject(request);
    } catch (e: any) {
      throw new BadRequestError({
        description: "Validation Error",
        body: e,
      });
    }

    try {
      return await activityManager.createActivity(request);
    } catch (e) {
      if (e instanceof ExtendedError) {
        throw e;
      }

      throw new InternalServerError({
        description: "Something went wrong",
      });
    }
  }

  @Get("/:activityid")
  async getActivity(
    @Param("activityid")
    activityId: string,
  ): Promise<ActivityResponse> {
    if (!isUUID(activityId)) {
      throw new BadRequestError({
        description: "Invalid activity ID",
      });
    }

    try {
      return await activityManager.getActivity(activityId);
    } catch (e) {
      if (e instanceof ExtendedError) {
        throw e;
      }

      throw new InternalServerError({
        description: "Something went wrong",
      });
    }
  }

  @Get("/by-destination/:destinationid")
  async getActivitiesByDestinationId(
    @Param("destinationid")
    destinationId: string,
  ): Promise<ActivityResponse[]> {
    if (!isUUID(destinationId)) {
      throw new BadRequestError({
        description: "Invalid destination ID",
      });
    }

    try {
      return await activityManager.getActivitiesByDestinationId(destinationId);
    } catch (e) {
      if (e instanceof ExtendedError) {
        throw e;
      }

      throw new InternalServerError({
        description: "Something went wrong",
      });
    }
  }

  @Get("/by-destination/:destinationid/day/:day")
  async getActivitiesByDestinationAndDay(
    @Param("destinationid")
    destinationId: string,
    @Param("day")
    day: string,
  ): Promise<ActivityResponse[]> {
    if (!isUUID(destinationId)) {
      throw new BadRequestError({
        description: "Invalid destination ID",
      });
    }

    const dayNumber = Number(day);

    if (!Number.isInteger(dayNumber) || dayNumber < 1) {
      throw new BadRequestError({
        description: "Invalid day",
      });
    }

    try {
      return await activityManager.getActivitiesByDestinationAndDay(
        destinationId,
        dayNumber,
      );
    } catch (e) {
      if (e instanceof ExtendedError) {
        throw e;
      }

      throw new InternalServerError({
        description: "Something went wrong",
      });
    }
  }

  @Put("/:activityid")
  async updateActivity(
    @Param("activityid")
    activityId: string,
    @Body() body: UpdateActivityRequest,
  ): Promise<ActivityResponse> {
    if (!isUUID(activityId)) {
      throw new BadRequestError({
        description: "Invalid activity ID",
      });
    }

    const request = new UpdateActivityBody(body);

    try {
      await validateOrReject(request);
    } catch (e: any) {
      throw new BadRequestError({
        description: "Validation Error",
        body: e,
      });
    }

    try {
      return await activityManager.updateActivity(activityId, request);
    } catch (e) {
      if (e instanceof ExtendedError) {
        throw e;
      }

      throw new InternalServerError({
        description: "Something went wrong",
      });
    }
  }

  @Delete("/:activityid")
  async deleteActivity(
    @Param("activityid")
    activityId: string,
  ): Promise<{ message: string }> {
    if (!isUUID(activityId)) {
      throw new BadRequestError({
        description: "Invalid activity ID",
      });
    }

    try {
      return await activityManager.deleteActivity(activityId);
    } catch (e) {
      if (e instanceof ExtendedError) {
        throw e;
      }

      throw new InternalServerError({
        description: "Something went wrong",
      });
    }
  }
}
