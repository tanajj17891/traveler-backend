import { IsNumber, IsOptional, IsUUID, Min } from "class-validator";

export type CreateBudgetRequest = {
  tripId: string;
  profileId: string;
  total: number;
  flights: number;
  accommodation: number;
  food: number;
  activities: number;
  misc: number;
};

export type UpdateBudgetRequest = {
  total?: number;
  flights?: number;
  accommodation?: number;
  food?: number;
  activities?: number;
  misc?: number;
};

export class CreateBudgetPost {
  @IsUUID()
  tripId: string;

  @IsUUID()
  profileId: string;

  @IsNumber()
  @Min(0)
  total: number;

  @IsNumber()
  @Min(0)
  flights: number;

  @IsNumber()
  @Min(0)
  accommodation: number;

  @IsNumber()
  @Min(0)
  food: number;

  @IsNumber()
  @Min(0)
  activities: number;

  @IsNumber()
  @Min(0)
  misc: number;

  constructor(data: CreateBudgetRequest) {
    this.tripId = data.tripId;
    this.profileId = data.profileId;
    this.total = data.total;
    this.flights = data.flights;
    this.accommodation = data.accommodation;
    this.food = data.food;
    this.activities = data.activities;
    this.misc = data.misc;
  }
}

export class UpdateBudgetBody {
  @IsNumber()
  @Min(0)
  @IsOptional()
  total?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  flights?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  accommodation?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  food?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  activities?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  misc?: number;

  constructor(data: UpdateBudgetRequest) {
    this.total = data.total;
    this.flights = data.flights;
    this.accommodation = data.accommodation;
    this.food = data.food;
    this.activities = data.activities;
    this.misc = data.misc;
  }
}

export class BudgetResponse {
  budgetId: string;
  tripId: string;
  profileId: string;
  createdAt: Date;
  updatedAt: Date;
  total: number;
  flights: number;
  accommodation: number;
  food: number;
  activities: number;
  misc: number;

  constructor(data: Partial<BudgetResponse>) {
    this.budgetId = data.budgetId ?? "";
    this.tripId = data.tripId ?? "";
    this.profileId = data.profileId ?? "";
    this.createdAt = data.createdAt ?? new Date();
    this.updatedAt = data.updatedAt ?? new Date();
    this.total = data.total ?? 0;
    this.flights = data.flights ?? 0;
    this.accommodation = data.accommodation ?? 0;
    this.food = data.food ?? 0;
    this.activities = data.activities ?? 0;
    this.misc = data.misc ?? 0;
  }
}
