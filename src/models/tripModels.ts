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
    this.latitude = data.latitude ? data.latitude : 0;
    this.longitude = data.longitude ? data.longitude : 0;
    this.arrivalDate = data.arrivalDate ? data.arrivalDate : "";
    this.leaveDate = data.leaveDate ? data.leaveDate : "";
  }
}

export class Budget {
  currency: string;
  total: number;
  flights: number;
  accomodation: number;
  food: number;
  activities: number;
  misc: number;

  constructor(data: Partial<Budget>) {
    this.currency = data.currency ? data.currency : "";
    this.total = data.total ? data.total : 0;
    this.flights = data.flights ? data.flights : 0;
    this.accomodation = data.accomodation ? data.accomodation : 0;
    this.food = data.food ? data.food : 0;
    this.activities = data.activities ? data.activities : 0;
    this.misc = data.misc ? data.misc : 0;
  }
}

export type CreateTripRequest = {
  profileId: string;
  tripName: string;
  destination: Destination[];
  travelers: string[];
  budget?: Budget;
  notes: string[];
  status?: TripStatus;
};

export class TripResponse {
  profileId: string;
  tripName: string;
  destination?: Destination[] | null;
  travelers: string[];
  budget?: Budget;
  notes: string[];
  status?: TripStatus;

  constructor(data: Partial<TripResponse>) {
    let destinations: Destination[] = [];
    data.destination?.forEach((destination) => {
      destinations.push(new Destination(destination));
    });
    this.destination = destinations;
    this.budget = data.budget;
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
  budget?: Budget;
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

  @IsOptional()
  budget?: Budget;

  @IsArray()
  notes: string[];

  @IsEnum(TripStatus)
  status: TripStatus;

  constructor(data: CreateTripRequest) {
    this.profileId = data.profileId;
    this.tripName = data.tripName;
    this.destination = data.destination;
    this.budget = data.budget;
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

  @IsOptional()
  budget?: Budget;

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
