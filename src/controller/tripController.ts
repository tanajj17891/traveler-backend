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
} from "../models/tripModels";
import {
  BadRequestError,
  ExtendedError,
  InternalServerError,
} from "../Errors/Errors";
import { validateOrReject } from "class-validator";
import { AuthMiddleware } from "../middleware/authMiddleware";

const tripManager = new TripManager();

@JsonController("/trips")
@UseBefore(AuthMiddleware)
export class TripController {
  @Post()
  async createTrip(@Body() body: CreateTripRequest) {
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
      return await tripManager.createTrip(body);
    } catch (e) {
      if (e instanceof ExtendedError) throw e;

      throw new InternalServerError({
        description: "Something went wrong",
      });
    }
  }

  @Get("/:tripId")
  async getTrip(@Param("tripId") tripId: string) {
    try {
      return await tripManager.getTrip(tripId);
    } catch (e) {
      if (e instanceof ExtendedError) throw e;

      throw new InternalServerError({
        description: "Something went wrong",
      });
    }
  }

  @Put("/:tripId")
  async updateTrip(
    @Param("tripId") tripId: string,
    @Body() body: UpdateTripRequest,
  ) {
    const request = new UpdateTripBody(body);

    try {
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

  @Delete("/:tripId")
  async deleteTrip(@Param("tripId") tripId: string) {
    try {
      return await tripManager.deleteTrip(tripId);
    } catch (e) {
      if (e instanceof ExtendedError) throw e;

      throw new InternalServerError({
        description: "Something went wrong",
      });
    }
  }
  @Get("/profile/:profileId")
  async getTripsByProfileId(@Param("profileId") profileId: string) {
    try {
      return await tripManager.getTripsByProfileId(profileId);
    } catch (e) {
      if (e instanceof ExtendedError) throw e;

      throw new InternalServerError({
        description: "Something went wrong",
      });
    }
  }
}
