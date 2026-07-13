import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsUUID,
} from "class-validator";
import { TravelStyle, TravelPreference } from "@prisma/client";

// Request Types

export type CreateProfileRequest = {
  cognitoSub: string;
  firstName?: string;
  lastName?: string;
  email: string;
  gender?: string;
  dateOfBirth?: string;
  state?: string;
  city?: string;
  travelStyle?: TravelStyle[];
  preferences?: TravelPreference[];
};

export type UpdateProfileRequest = {
  firstName?: string;
  lastName?: string;
  gender?: string;
  dateOfBirth?: string;
  state?: string;
  city?: string;
  travelStyle?: TravelStyle[];
  preferences?: TravelPreference[];
};

export interface ProfileResponse {
  cognitoSub: string;
  firstName?: string | null;
  lastName?: string | null;
  email: string;
  gender?: string | null;
  dateOfBirth?: string | null;
  state?: string | null;
  city?: string | null;
  travelStyle?: TravelStyle[];
  preferences?: TravelPreference[];
}

export class CreateProfilePost {
  @IsNotEmpty({ message: "CognitoSub is required" })
  @IsUUID()
  cognitoSub: string;

  @IsNotEmpty({ message: "Email is required" })
  @IsEmail({}, { message: "Invalid email format" })
  email: string;

  @IsOptional()
  firstName?: string;

  @IsOptional()
  lastName?: string;

  @IsOptional()
  gender?: string;

  @IsOptional()
  dateOfBirth?: string;

  @IsOptional()
  state?: string;

  @IsOptional()
  city?: string;

  @IsOptional()
  @IsEnum(TravelStyle, {
    each: true,
    message: "Invalid travel style",
  })
  travelStyle?: TravelStyle[];

  @IsOptional()
  @IsEnum(TravelPreference, {
    each: true,
    message: "Invalid preference",
  })
  preferences?: TravelPreference[];

  constructor(data: CreateProfileRequest) {
    this.cognitoSub = data.cognitoSub;
    this.email = data.email;
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.gender = data.gender;
    this.dateOfBirth = data.dateOfBirth;
    this.state = data.state;
    this.city = data.city;
    this.travelStyle = data.travelStyle;
    this.preferences = data.preferences;
  }
}

// Update Profile Validator

export class UpdateProfilePost {
  @IsOptional()
  firstName?: string;

  @IsOptional()
  lastName?: string;

  @IsOptional()
  gender?: string;

  @IsOptional()
  dateOfBirth?: string;

  @IsOptional()
  state?: string;

  @IsOptional()
  city?: string;

  @IsOptional()
  @IsEnum(TravelStyle, {
    each: true,
    message: "Invalid travel style",
  })
  travelStyle?: TravelStyle[];

  @IsOptional()
  @IsEnum(TravelPreference, {
    each: true,
    message: "Invalid preference",
  })
  preferences?: TravelPreference[];

  constructor(data: UpdateProfileRequest) {
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.gender = data.gender;
    this.dateOfBirth = data.dateOfBirth;
    this.state = data.state;
    this.city = data.city;
    this.travelStyle = data.travelStyle;
    this.preferences = data.preferences;
  }
}
