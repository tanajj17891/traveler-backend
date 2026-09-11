import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from "class-validator";

import { ActivityType } from "@prisma/client";

export type CreateActivityRequest = {
  destinationId: string;
  day: number;
  startTime: string;
  activityType: ActivityType;
  description: string;
  notes?: string;
};

export type UpdateActivityRequest = {
  day?: number;
  startTime?: string;
  activityType?: ActivityType;
  description?: string;
  notes?: string;
};

export class CreateActivityPost {
  @IsUUID()
  destinationId: string;

  @IsInt()
  @Min(1)
  day: number;

  @IsString()
  @IsNotEmpty()
  startTime: string;

  @IsEnum(ActivityType)
  activityType: ActivityType;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsOptional()
  notes?: string;

  constructor(data: CreateActivityRequest) {
    this.destinationId = data.destinationId;
    this.day = data.day;
    this.startTime = data.startTime;
    this.activityType = data.activityType;
    this.description = data.description;
    this.notes = data.notes;
  }
}

export class UpdateActivityBody {
  @IsInt()
  @Min(1)
  @IsOptional()
  day?: number;

  @IsString()
  @IsOptional()
  startTime?: string;

  @IsEnum(ActivityType)
  @IsOptional()
  activityType?: ActivityType;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  notes?: string;

  constructor(data: UpdateActivityRequest) {
    this.day = data.day;
    this.startTime = data.startTime;
    this.activityType = data.activityType;
    this.description = data.description;
    this.notes = data.notes;
  }
}

export class ActivityResponse {
  activityId: string;
  destinationId: string;
  day: number;
  startTime: string;
  activityType: ActivityType;
  description: string;
  notes: string | null;

  constructor(data: Partial<ActivityResponse>) {
    this.activityId = data.activityId ?? "";
    this.destinationId = data.destinationId ?? "";
    this.day = data.day ?? 1;
    this.startTime = data.startTime ?? "";
    this.activityType = data.activityType ?? ActivityType.OTHER;
    this.description = data.description ?? "";
    this.notes = data.notes ?? null;
  }
}
