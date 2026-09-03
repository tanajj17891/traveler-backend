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
import { DestinationManager } from "../managers/destinationsManager";
import {
  CreateDestinationPost,
  CreateDestinationRequest,
  DestinationResponse,
  UpdateDestinationBody,
  UpdateDestinationRequest,
} from "../models/destinationsModels";
import {
  BadRequestError,
  ExtendedError,
  InternalServerError,
} from "../Errors/Errors";
import { AuthMiddleware } from "../middleware/authMiddleware";

const destinationManager = new DestinationManager();

@JsonController("/destinations")
@UseBefore(AuthMiddleware)
export class DestinationController {
  @Post()
  async createDestination(
    @Body() body: CreateDestinationRequest,
  ): Promise<DestinationResponse> {
    const request = new CreateDestinationPost(body);

    try {
      await validateOrReject(request);
    } catch (e: any) {
      throw new BadRequestError({
        description: "Validation Error",
        body: e,
      });
    }

    try {
      return await destinationManager.createDestination(request);
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
  async getDestinationsByTripId(
    @Param("tripid") tripId: string,
  ): Promise<DestinationResponse[]> {
    if (!isUUID(tripId)) {
      throw new BadRequestError({
        description: "Invalid trip ID",
      });
    }

    try {
      return await destinationManager.getDestinationsByTripId(tripId);
    } catch (e) {
      if (e instanceof ExtendedError) {
        throw e;
      }

      throw new InternalServerError({
        description: "Something went wrong",
      });
    }
  }

  @Get("/:destinationid")
  async getDestination(
    @Param("destinationid")
    destinationId: string,
  ): Promise<DestinationResponse> {
    if (!isUUID(destinationId)) {
      throw new BadRequestError({
        description: "Invalid destination ID",
      });
    }

    try {
      return await destinationManager.getDestination(destinationId);
    } catch (e) {
      if (e instanceof ExtendedError) {
        throw e;
      }

      throw new InternalServerError({
        description: "Something went wrong",
      });
    }
  }

  @Put("/:destinationid")
  async updateDestination(
    @Param("destinationid")
    destinationId: string,
    @Body() body: UpdateDestinationRequest,
  ): Promise<DestinationResponse> {
    if (!isUUID(destinationId)) {
      throw new BadRequestError({
        description: "Invalid destination ID",
      });
    }

    const request = new UpdateDestinationBody(body);

    try {
      await validateOrReject(request);
    } catch (e: any) {
      throw new BadRequestError({
        description: "Validation Error",
        body: e,
      });
    }

    try {
      return await destinationManager.updateDestination(destinationId, request);
    } catch (e) {
      if (e instanceof ExtendedError) {
        throw e;
      }

      throw new InternalServerError({
        description: "Something went wrong",
      });
    }
  }

  @Delete("/:destinationid")
  async deleteDestination(
    @Param("destinationid")
    destinationId: string,
  ): Promise<{ message: string }> {
    if (!isUUID(destinationId)) {
      throw new BadRequestError({
        description: "Invalid destination ID",
      });
    }

    try {
      return await destinationManager.deleteDestination(destinationId);
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
