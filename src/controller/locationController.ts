import {
  Body,
  JsonController,
  Post,
  Delete,
  Put,
  Param,
  UseBefore,
  Get,
  QueryParam,
} from "routing-controllers";
import { AuthMiddleware } from "../middleware/authMiddleware";
import { LocationManager } from "../managers/locationManager";

const locationManager = new LocationManager();

@JsonController("/location")
@UseBefore(AuthMiddleware)
export class LocationController {
  @Get("/autocomplete")
  async getAutoCompleteLocations(@QueryParam("place") place: string) {
    try {
      return await locationManager.getAutoCompleteLocations(place);
    } catch (e: any) {
      console.log(e.statusDetails);
    }
  }

  @Get("/place")
  async getPlace(@QueryParam("placeid") placeId: string) {
    try {
      return await locationManager.getPlace(placeId);
    } catch (e) {
      console.log(JSON.stringify(e));
    }
  }
}
