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
export type Destination = {
  name: string;
  latitude: number;
  longitude: number;
};

export type CreateTripRequest = {
  profileId: string;
  tripName: string;
  destination: Destination[];
  travelers: string[];
  budget?: object;
  notes: string[];
  status?: TripStatus;
};

export interface TripResponse {
  profileId: string;
  tripName: string;
  destination: Destination[];
  travelers: string[];
  budget?: object;
  notes: string[];
  status?: TripStatus;
}

export type UpdateTripRequest = {
  tripName?: string;
  destination?: Destination[];
  travelers?: string[];
  budget?: object;
  notes?: string[];
  status?: TripStatus;
};

export class CreateTripPost {
  @IsUUID()
  profileId: string;

  @IsNotEmpty()
  @IsString()
  tripName: string;

  @IsArray()
  destination: Destination[];

  @IsArray()
  travelers: string[];

  @IsOptional()
  budget?: object;

  @IsArray()
  notes: string[];

  @IsEnum(TripStatus)
  status: TripStatus;

  constructor(data: CreateTripRequest) {
    this.profileId = data.profileId;
    this.tripName = data.tripName;
    this.destination = data.destination;
    this.travelers = data.travelers;
    this.budget = data.budget;
    this.notes = data.notes;
    this.status = data.status ? data.status : TripStatus.PLANNING;
  }
}

export class UpdateTripBody {
  @IsString()
  @IsOptional()
  tripName?: string;

  @IsArray()
  @IsOptional()
  destination?: Destination[];

  @IsArray()
  @IsOptional()
  travelers?: string[];

  @IsOptional()
  budget?: object;

  @IsArray()
  @IsOptional()
  notes?: string[];

  @IsEnum(TripStatus)
  @IsOptional()
  status?: TripStatus;

  constructor(data: UpdateTripRequest) {
    this.tripName = data.tripName;
    this.destination = data.destination;
    this.travelers = data.travelers;
    this.budget = data.budget;
    this.notes = data.notes;
    this.status = data.status;
  }
}
