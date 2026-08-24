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
import { BudgetManager } from "../managers/budgetManager";
import {
  BudgetResponse,
  CreateBudgetPost,
  CreateBudgetRequest,
  UpdateBudgetBody,
  UpdateBudgetRequest,
} from "../models/budgetModels";
import {
  BadRequestError,
  ExtendedError,
  InternalServerError,
} from "../Errors/Errors";
import { AuthMiddleware } from "../middleware/authMiddleware";

const budgetManager = new BudgetManager();

@JsonController("/budgets")
@UseBefore(AuthMiddleware)
export class BudgetController {
  @Post()
  async createBudget(
    @Body() body: CreateBudgetRequest,
  ): Promise<BudgetResponse> {
    const request = new CreateBudgetPost(body);

    try {
      await validateOrReject(request);
    } catch (e: any) {
      throw new BadRequestError({
        description: "Validation Error",
        body: e,
      });
    }

    try {
      return await budgetManager.createBudget(request);
    } catch (e) {
      if (e instanceof ExtendedError) {
        throw e;
      }

      throw new InternalServerError({
        description: "Something went wrong",
      });
    }
  }

  @Get("/:budgetid")
  async getBudget(
    @Param("budgetid") budgetId: string,
  ): Promise<BudgetResponse> {
    if (!isUUID(budgetId)) {
      throw new BadRequestError({
        description: "Invalid budget ID",
      });
    }

    try {
      return await budgetManager.getBudget(budgetId);
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
  async getBudgetsByTripId(
    @Param("tripid") tripId: string,
  ): Promise<BudgetResponse[]> {
    if (!isUUID(tripId)) {
      throw new BadRequestError({
        description: "Invalid trip ID",
      });
    }

    try {
      return await budgetManager.getBudgetsByTripId(tripId);
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
  async getBudgetByTripAndProfile(
    @Param("tripid") tripId: string,
    @Param("profileid") profileId: string,
  ): Promise<BudgetResponse> {
    if (!isUUID(tripId) || !isUUID(profileId)) {
      throw new BadRequestError({
        description: "Invalid trip ID or profile ID",
      });
    }

    try {
      return await budgetManager.getBudgetByTripAndProfile(tripId, profileId);
    } catch (e) {
      if (e instanceof ExtendedError) {
        throw e;
      }

      throw new InternalServerError({
        description: "Something went wrong",
      });
    }
  }

  @Put("/:budgetid")
  async updateBudget(
    @Param("budgetid") budgetId: string,
    @Body() body: UpdateBudgetRequest,
  ): Promise<BudgetResponse> {
    if (!isUUID(budgetId)) {
      throw new BadRequestError({
        description: "Invalid budget ID",
      });
    }

    const request = new UpdateBudgetBody(body);

    try {
      await validateOrReject(request);
    } catch (e: any) {
      throw new BadRequestError({
        description: "Validation Error",
        body: e,
      });
    }

    try {
      return await budgetManager.updateBudget(budgetId, request);
    } catch (e) {
      if (e instanceof ExtendedError) {
        throw e;
      }

      throw new InternalServerError({
        description: "Something went wrong",
      });
    }
  }

  @Delete("/:budgetid")
  async deleteBudget(
    @Param("budgetid") budgetId: string,
  ): Promise<{ message: string }> {
    if (!isUUID(budgetId)) {
      throw new BadRequestError({
        description: "Invalid budget ID",
      });
    }

    try {
      return await budgetManager.deleteBudget(budgetId);
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
