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
  UpdateTripRequest,
} from "../models/tripModels";
import { validateOrReject } from "class-validator";
import { AuthMiddleware } from "../middleware/authMiddleware";

const tripManager = new TripManager();

@JsonController("/trips")
@UseBefore(AuthMiddleware)
export class TripController {
  @Post()
  async createTrip(@Body() body: CreateTripRequest) {
    const request = new CreateTripPost(body);
    await validateOrReject(request);

    return tripManager.createTrip(body);
  }

  @Get("/:tripId")
  async getTrip(@Param("tripId") tripId: string) {
    return tripManager.getTrip(tripId);
  }

  @Put("/:tripId")
  async updateTrip(
    @Param("tripId") tripId: string,
    @Body() body: UpdateTripRequest,
  ) {
    return tripManager.updateTrip(tripId, body);
  }

  @Delete("/:tripId")
  async deleteTrip(@Param("tripId") tripId: string) {
    return tripManager.deleteTrip(tripId);
  }
}
