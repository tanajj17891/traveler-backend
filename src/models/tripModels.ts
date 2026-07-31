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
export class Destination {
  name: string;
  latitude: number;
  longitude: number;
  arrivalDate: string;
  leaveDate: string;

  constructor(data: Partial<Destination>) {
    this.name = data.name ? data.name : "";
    this.latitude = data.latitude ?? 0;
    this.longitude = data.longitude ?? 0;
    this.arrivalDate = data.arrivalDate ? data.arrivalDate : "";
    this.leaveDate = data.leaveDate ? data.leaveDate : "";
  }
}

export type CreateTripRequest = {
  profileId: string;
  tripName: string;
  destination: Destination[];
  travelers: string[];

  notes: string[];
  status?: TripStatus;
};

export class TripResponse {
  tripId: string;
  profileId: string;
  tripName: string;
  destination?: Destination[] | null;
  travelers: string[];

  notes: string[];
  status?: TripStatus;

  constructor(data: Partial<TripResponse>) {
    let destinations: Destination[] = [];
    data.destination?.forEach((destination) => {
      destinations.push(new Destination(destination));
    });
    this.destination = destinations;
    this.tripId = data.tripId ?? "";

    this.profileId = data.profileId ? data.profileId : "";
    this.tripName = data.tripName ? data.tripName : "";
    this.travelers = data.travelers ? data.travelers : [];
    this.notes = data.notes ? data.notes : [];
    this.status = data.status;
  }
}

export type UpdateTripRequest = {
  tripName?: string;
  destination?: Destination[];
  travelers?: string[];
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
  @IsOptional()
  travelers?: string[];

  @IsArray()
  notes: string[];

  @IsEnum(TripStatus)
  status: TripStatus;

  constructor(data: CreateTripRequest) {
    this.profileId = data.profileId;
    this.tripName = data.tripName;
    this.destination = data.destination;

    this.notes = data.notes;
    this.status = data.status ? data.status : TripStatus.PLANNING;
    this.travelers = data?.travelers
      ? [...new Set(data.travelers.map((email) => email.trim().toLowerCase()))]
      : undefined;
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
    this.notes = data.notes;
    this.status = data.status;
  }
}
