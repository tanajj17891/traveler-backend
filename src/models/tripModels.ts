import {
  IsUUID,
  IsArray,
  IsOptional,
  IsString,
  IsNotEmpty,
} from "class-validator";
import { TripStatus } from "@prisma/client";

export type CreateTripRequest = {
  profileId: string;
  tripName: string;
  destination: string[];
  travelers: string[];
  budget?: object;
  notes: string[];
  satus?: TripStatus;
};

export interface TripReponse {
  profileId: string;
  trip_name: string;
  destination: string[];
  travelers: string[];
  budget?: object;
  notes: string[];
  satus?: TripStatus;
}

export type UpdateTripRequest = {
  tripName?: string;
  destination: string[];
  travelers: string[];
  budget?: object;
  notes?: string[];
  satus?: TripStatus[];
};

export class CreateTripPost {
  @IsUUID()
  profileId: string;

  @IsNotEmpty()
  @IsString()
  trip_name: string;

  @IsArray()
  destination: string[];

  @IsArray()
  travelers: string[];

  @IsOptional()
  budget?: object;

  @IsArray()
  notes: string[];

  constructor(data: CreateTripRequest) {
    this.profileId = data.profileId;
    this.trip_name = data.tripName;
    this.destination = data.destination;
    this.travelers = data.travelers;
    this.budget = data.budget;
    this.notes = data.notes;
  }
}
