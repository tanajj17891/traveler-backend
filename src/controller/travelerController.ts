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
import { TravelerManager } from "../managers/travelerManager";
import {
  TravelerResponse,
  CreateTravelerPost,
  CreateTravelerRequest,
  UpdateTravelerBody,
  UpdateTravelerRequest,
} from "../models/travelerModels";
import {
  BadRequestError,
  ExtendedError,
  InternalServerError,
} from "../Errors/Errors";
import { AuthMiddleware } from "../middleware/authMiddleware";

const travelerManager = new TravelerManager();

@JsonController("/travelers")
@UseBefore(AuthMiddleware)
export class TravelersController {
  @Post()
  async createTraveler(
    @Body() body: CreateTravelerRequest,
  ): Promise<TravelerResponse> {
    const request = new CreateTravelerPost(body);

    try {
      await validateOrReject(request);
    } catch (e: any) {
      throw new BadRequestError({
        description: "Validation Error",
        body: e,
      });
    }

    try {
      return await travelerManager.createTraveler(request);
    } catch (e) {
      if (e instanceof ExtendedError) {
        throw e;
      }

      throw new InternalServerError({
        description: "Something went wrong",
      });
    }
  }

  @Get("/:travelerid")
  async getTraveler(
    @Param("travelerid") travelerId: string,
  ): Promise<TravelerResponse> {
    if (!isUUID(travelerId)) {
      throw new BadRequestError({
        description: "Invalid traveler ID",
      });
    }

    try {
      return await travelerManager.getTraveler(travelerId);
    } catch (e) {
      if (e instanceof ExtendedError) {
        throw e;
      }

      throw new InternalServerError({
        description: "Something went wrong",
      });
    }
  }

  @Get("/by-trip/:tripid")
  async getTravelersByTripId(
    @Param("tripid") tripId: string,
  ): Promise<TravelerResponse[]> {
    if (!isUUID(tripId)) {
      throw new BadRequestError({
        description: "Invalid trip ID",
      });
    }

    try {
      return await travelerManager.getTravelersByTripId(tripId);
    } catch (e) {
      if (e instanceof ExtendedError) {
        throw e;
      }

      throw new InternalServerError({
        description: "Something went wrong",
      });
    }
  }

  @Get("/by-trip/:tripid/profile/:profileid")
  async getTravelerByTripIdAndProfileId(
    @Param("tripid") tripId: string,
    @Param("profileid") profileId: string,
  ): Promise<TravelerResponse> {
    if (!isUUID(tripId) || !isUUID(profileId)) {
      throw new BadRequestError({
        description: "Invalid trip ID or profile ID",
      });
    }

    try {
      return await travelerManager.getTravelerByTripIdAndProfileId(
        tripId,
        profileId,
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

  @Put("/:travelerid")
  async updateTraveler(
    @Param("travelerid") travelerId: string,
    @Body() body: UpdateTravelerRequest,
  ): Promise<TravelerResponse> {
    if (!isUUID(travelerId)) {
      throw new BadRequestError({
        description: "Invalid traveler ID",
      });
    }

    const request = new UpdateTravelerBody(body);

    try {
      await validateOrReject(request);
    } catch (e: any) {
      throw new BadRequestError({
        description: "Validation Error",
        body: e,
      });
    }

    try {
      return await travelerManager.updateTravelers(travelerId, request);
    } catch (e) {
      if (e instanceof ExtendedError) {
        throw e;
      }

      throw new InternalServerError({
        description: "Something went wrong",
      });
    }
  }

  @Delete("/:travelerid")
  async deleteTraveler(
    @Param("travelerid") travelerId: string,
  ): Promise<{ message: string }> {
    if (!isUUID(travelerId)) {
      throw new BadRequestError({
        description: "Invalid traveler ID",
      });
    }

    try {
      return await travelerManager.deleteTraveler(travelerId);
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
