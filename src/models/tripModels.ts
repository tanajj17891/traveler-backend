import {
  IsUUID,
  IsArray,
  IsOptional,
  IsString,
  IsNotEmpty,
} from "class-validator";
import { TripStatus } from "@prisma/client";

export type CreateTripRequest = {
  profile_id: string;
  trip_name: string;
  destination: string[];
  travelers: string[];
  budget?: object;
  notes: string[];
  satus?: TripStatus;
};

export interface TripReponse {
  profile_id: string;
  trip_name: string;
  destination: string[];
  travelers: string[];
  budget?: object;
  notes: string[];
  satus?: TripStatus;
}

export type UpdateTripRequest = {
  trip_name?: string;
  destination: string[];
  travelers: string[];
  budget?: object;
  notes?: string[];
  satus?: TripStatus[];
};

export class CreateTripPost {
  @IsUUID()
  profile_id: string;

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
    this.profile_id = data.profile_id;
    this.trip_name = data.trip_name;
    this.destination = data.destination;
    this.travelers = data.travelers;
    this.budget = data.budget;
    this.notes = data.notes;
  }
}
