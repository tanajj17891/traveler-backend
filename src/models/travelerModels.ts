import { IsNumber, IsOptional, IsUUID, Min } from "class-validator";

export type CreateTravelerRequest = {
  profileId: string;
  tripId: string;
  email: string;
};

export type UpdateTravelerRequest = {
  profileId?: string;
  tripId?: string;
  email?: string;
};

export class CreateTravelerPost {
  @IsUUID()
  tripId: string;

  @IsUUID()
  profileId: string;

  email: string;

  constructor(data: CreateTravelerRequest) {
    this.tripId = data.tripId;
    this.profileId = data.profileId;
    this.email = data.email;
  }
}

export class UpdateTravelerBody {
  email: string;

  constructor(data: UpdateTravelerRequest) {
    this.email = data.email ?? "";
  }
}

export class TravelerResponse {
  travelerId: string;
  tripId: string;
  profileId: string;
  createdAt: Date;
  updatedAt: Date;
  email: string;

  constructor(data: Partial<TravelerResponse>) {
    this.travelerId = data.travelerId ?? "";
    this.tripId = data.tripId ?? "";
    this.profileId = data.profileId ?? "";
    this.createdAt = data.createdAt ?? new Date();
    this.updatedAt = data.updatedAt ?? new Date();
    this.email = data.email ?? "";
  }
}
