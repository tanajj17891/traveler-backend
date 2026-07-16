import { TripManager } from "../managers/tripManager";
import {
  Body,
  JsonController,
  Post,
  Delete,
  Put,
  Param,
  UseBefore,
  Get,
} from "routing-controllers";
import {
  CreateTripPost,
  CreateTripRequest,
  UpdateTripBody,
  UpdateTripRequest,
  TripResponse,
} from "../models/tripModels";
import {
  BadRequestError,
  ExtendedError,
  InternalServerError,
} from "../Errors/Errors";
import { validateOrReject, isUUID } from "class-validator";
import { AuthMiddleware } from "../middleware/authMiddleware";

const tripManager = new TripManager();

@JsonController("/trips")
@UseBefore(AuthMiddleware)
export class TripController {
  @Post()
  async createTrip(@Body() body: CreateTripRequest): Promise<TripResponse> {
    const request = new CreateTripPost(body);

    try {
      await validateOrReject(request);
    } catch (e: any) {
      throw new BadRequestError({
        description: "Validation Error",
        body: e,
      });
    }

    try {
      return await tripManager.createTrip(request);
    } catch (e) {
      if (e instanceof ExtendedError) throw e;

      throw new InternalServerError({
        description: "Something went wrong",
      });
    }
  }

  @Put("/:tripid")
  async updateTrip(
    @Param("tripid") tripId: string,
    @Body() body: UpdateTripRequest,
  ): Promise<TripResponse> {
    const request = new UpdateTripBody(body);

    try {
      isUUID(tripId);
      await validateOrReject(request);
    } catch (e: any) {
      throw new BadRequestError({
        description: "Validation Error",
        body: e,
      });
    }

    try {
      return await tripManager.updateTrip(tripId, body);
    } catch (e) {
      if (e instanceof ExtendedError) throw e;

      throw new InternalServerError({
        description: "Something went wrong",
      });
    }
  }

  @Delete("/:tripid")
  async deleteTrip(
    @Param("tripid") tripid: string,
  ): Promise<{ message: string }> {
    try {
      isUUID(tripid);
      return await tripManager.deleteTrip(tripid);
    } catch (e) {
      if (e instanceof ExtendedError) throw e;

      throw new InternalServerError({
        description: "Something went wrong",
      });
    }
  }
  @Get("/by-profile/:profileid") //gets all trips by propfile id
  async getTripsByProfileId(
    @Param("profileid") profileid: string,
  ): Promise<TripResponse[]> {
    try {
      isUUID(profileid);
      return await tripManager.getTripsByProfileId(profileid);
    } catch (e) {
      if (e instanceof ExtendedError) throw e;

      throw new InternalServerError({
        description: "Something went wrong",
      });
    }
  }

  @Get("/:tripid")
  async getTrip(@Param("tripid") tripId: string): Promise<TripResponse> {
    try {
      isUUID(tripId);
      return await tripManager.getTrip(tripId);
    } catch (e) {
      if (e instanceof ExtendedError) throw e;

      throw new InternalServerError({
        description: "Something went wrong",
      });
    }
  }
}
