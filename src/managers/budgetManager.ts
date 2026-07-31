import { PrismaClient } from "@prisma/client";
import {
  BadRequestError,
  ExtendedError,
  InternalServerError,
  NotFoundError,
} from "../Errors/Errors";
import {
  BudgetResponse,
  CreateBudgetPost,
  UpdateBudgetRequest,
} from "../models/budgetModels";

const prisma = new PrismaClient();

export class BudgetManager {
  async createBudget(input: CreateBudgetPost): Promise<BudgetResponse> {
    try {
      const trip = await prisma.trip.findUnique({
        where: {
          tripId: input.tripId,
        },
      });

      if (!trip) {
        throw new NotFoundError({
          description: "Trip not found",
        });
      }

      const profile = await prisma.profile.findUnique({
        where: {
          profileId: input.profileId,
        },
      });

      if (!profile) {
        throw new NotFoundError({
          description: "Profile not found",
        });
      }

      const existingBudget = await prisma.budgets.findUnique({
        where: {
          tripId_profileId: {
            tripId: input.tripId,
            profileId: input.profileId,
          },
        },
      });

      if (existingBudget) {
        throw new BadRequestError({
          description: "A budget already exists for this traveler on this trip",
        });
      }

      const budget = await prisma.budgets.create({
        data: {
          tripId: input.tripId,
          profileId: input.profileId,
          total: input.total,
          flights: input.flights,
          accommodation: input.accommodation,
          food: input.food,
          activities: input.activities,
          misc: input.misc,
        },
      });

      return new BudgetResponse(budget);
    } catch (e) {
      console.error("BUDGET ERROR:", e);

      if (e instanceof ExtendedError) {
        throw e;
      }

      throw new InternalServerError({
        description: "Failed to create budget",
      });
    }
  }

  async getBudget(budgetId: string): Promise<BudgetResponse> {
    try {
      const budget = await prisma.budgets.findUnique({
        where: {
          budgetId,
        },
      });

      if (!budget) {
        throw new NotFoundError({
          description: "Budget not found",
        });
      }

      return new BudgetResponse(budget);
    } catch (e) {
      console.error("BUDGET ERROR:", e);

      if (e instanceof ExtendedError) {
        throw e;
      }

      throw new InternalServerError({
        description: "Failed to get budget",
      });
    }
  }

  async getBudgetsByTripId(tripId: string): Promise<BudgetResponse[]> {
    try {
      const budgets = await prisma.budgets.findMany({
        where: {
          tripId,
        },
        orderBy: {
          createdAt: "asc",
        },
      });

      return budgets.map((budgets) => new BudgetResponse(budgets));
    } catch (e) {
      console.error("BUDGET ERROR:", e);

      if (e instanceof ExtendedError) {
        throw e;
      }

      throw new InternalServerError({
        description: "Failed to get trip budgets",
      });
    }
  }

  async getBudgetByTripAndProfile(
    tripId: string,
    profileId: string,
  ): Promise<BudgetResponse> {
    try {
      const budget = await prisma.budgets.findUnique({
        where: {
          tripId_profileId: {
            tripId,
            profileId,
          },
        },
      });

      if (!budget) {
        throw new NotFoundError({
          description: "Budget not found",
        });
      }

      return new BudgetResponse(budget);
    } catch (e) {
      console.error("BUDGET ERROR:", e);

      if (e instanceof ExtendedError) {
        throw e;
      }

      throw new InternalServerError({
        description: "Failed to get budget",
      });
    }
  }

  async updateBudget(
    budgetId: string,
    input: UpdateBudgetRequest,
  ): Promise<BudgetResponse> {
    try {
      const existingBudget = await prisma.budgets.findUnique({
        where: {
          budgetId,
        },
      });

      if (!existingBudget) {
        throw new NotFoundError({
          description: "Budget not found",
        });
      }

      const updatedBudget = await prisma.budgets.update({
        where: {
          budgetId,
        },
        data: input,
      });

      return new BudgetResponse(updatedBudget);
    } catch (e) {
      console.error("BUDGET ERROR:", e);

      if (e instanceof ExtendedError) {
        throw e;
      }

      throw new InternalServerError({
        description: "Failed to update budget",
      });
    }
  }

  async deleteBudget(budgetId: string): Promise<{ message: string }> {
    try {
      const existingBudget = await prisma.budgets.findUnique({
        where: {
          budgetId,
        },
      });

      if (!existingBudget) {
        throw new NotFoundError({
          description: "Budget not found",
        });
      }

      await prisma.budgets.delete({
        where: {
          budgetId,
        },
      });

      return {
        message: "Budget deleted successfully",
      };
    } catch (e) {
      console.error("BUDGET ERROR:", e);

      if (e instanceof ExtendedError) {
        throw e;
      }

      throw new InternalServerError({
        description: "Failed to delete budget",
      });
    }
  }
}
