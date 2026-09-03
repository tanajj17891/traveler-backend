import {
  IsUUID,
  IsArray,
  IsOptional,
  IsString,
  IsNotEmpty,
  IsEnum,
} from "class-validator";
enum TripStatus {
  PLANNING = "PLANNING",
  UPCOMING = "UPCOMING",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
}

export type CreateTripRequest = {
  profileId: string;
  tripName: string;

  status?: TripStatus;
};

export class TripResponse {
  tripId: string;
  profileId: string;
  tripName: string;

  status?: TripStatus;

  constructor(data: Partial<TripResponse>) {
    this.tripId = data.tripId ?? "";

    this.profileId = data.profileId ? data.profileId : "";
    this.tripName = data.tripName ? data.tripName : "";

    this.status = data.status;
  }
}

export type UpdateTripRequest = {
  tripName?: string;

  status?: TripStatus;
};

export class CreateTripPost {
  @IsUUID()
  profileId: string;

  @IsNotEmpty()
  @IsString()
  tripName: string;

  @IsEnum(TripStatus)
  status: TripStatus;

  constructor(data: CreateTripRequest) {
    this.profileId = data.profileId;
    this.tripName = data.tripName;

    this.status = data.status ? data.status : TripStatus.PLANNING;
  }
}

export class UpdateTripBody {
  @IsString()
  @IsOptional()
  tripName?: string;

  @IsArray()
  @IsOptional()
  @IsEnum(TripStatus)
  @IsOptional()
  status?: TripStatus;

  constructor(data: UpdateTripRequest) {
    this.tripName = data.tripName;

    this.status = data.status;
  }
}
