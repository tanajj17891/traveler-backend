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

JsonController("/trips");
@UseBefore(AuthMiddleware)
export class TripController {
  @Post()
  async createTrip(@Body() body: CreateTripRequest) {
    const request = new CreateTripPost(body);
    await validateOrReject(request);

    return tripManager.createTrip(body);
  }

  @Get("/:trip_id")
  async getTrip(@Param("trip_id") trip_id: string) {
    return tripManager.getTrip(trip_id);
  }

  @Put(":/trip_id")
  async updateTrip(
    @Param("trip_id") trip_id: string,
    @Body() body: UpdateTripRequest,
  ) {
    return tripManager.updateTrip(trip_id, body);
  }

  @Delete("/:trip_id")
  async deleteTrip(@Param("trip_id") trip_id: string) {
    return tripManager.deleteTrip(trip_id);
  }
}
