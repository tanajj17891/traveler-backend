import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from "class-validator";

export type CreateDestinationRequest = {
  tripId: string;
  name: string;
  latitude: number;
  longitude: number;
  arrivalDate: string;
  leaveDate: string;
};

export type UpdateDestinationRequest = {
  name?: string;
  latitude?: number;
  longitude?: number;
  arrivalDate?: string;
  leaveDate?: string;
};

export class CreateDestinationPost {
  @IsUUID()
  tripId: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;

  @IsString()
  arrivalDate: string;

  @IsString()
  leaveDate: string;

  constructor(data: CreateDestinationRequest) {
    this.tripId = data.tripId;
    this.name = data.name;
    this.latitude = data.latitude;
    this.longitude = data.longitude;
    this.arrivalDate = data.arrivalDate;
    this.leaveDate = data.leaveDate;
  }
}

export class UpdateDestinationBody {
  @IsString()
  @IsOptional()
  name?: string;

  @IsNumber()
  @IsOptional()
  latitude?: number;

  @IsNumber()
  @IsOptional()
  longitude?: number;

  @IsString()
  @IsOptional()
  arrivalDate?: string;

  @IsString()
  @IsOptional()
  leaveDate?: string;

  constructor(data: UpdateDestinationRequest) {
    this.name = data.name;
    this.latitude = data.latitude;
    this.longitude = data.longitude;
    this.arrivalDate = data.arrivalDate;
    this.leaveDate = data.leaveDate;
  }
}

export class DestinationResponse {
  destinationId: string;
  tripId: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  latitude: number;
  longitude: number;
  arrivalDate: string;
  leaveDate: string;

  constructor(data: Partial<DestinationResponse>) {
    this.destinationId = data.destinationId ?? "";
    this.tripId = data.tripId ?? "";
    this.createdAt = data.createdAt ?? new Date();
    this.updatedAt = data.updatedAt ?? new Date();
    this.name = data.name ?? "";
    this.latitude = data.latitude ?? 0;
    this.longitude = data.longitude ?? 0;
    this.arrivalDate = data.arrivalDate ?? "";
    this.leaveDate = data.leaveDate ?? "";
  }
}
