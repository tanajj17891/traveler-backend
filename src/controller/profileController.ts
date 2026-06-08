import { ProfileManager } from "../managers/profileManager";
import {
  Body,
  JsonController,
  Post,
  Delete,
  Put,
  Param,
  UseBefore,
  Get,
} from "routing-controllers";
import {
  CreateProfilePost,
  UpdateProfileRequest,
  UpdateProfilePost,
  CreateProfileRequest,
} from "../models/profileModels";
import "reflect-metadata";
import {
  BadRequestError,
  ExtendedError,
  InternalServerError,
} from "../Errors/Errors";
import { validateOrReject } from "class-validator";
import { TravelStyle, TravelPreference } from "@prisma/client";
import { AuthMiddleware } from "../middleware/authMiddleware";

const profileManager = new ProfileManager();

@JsonController("/profile")
@UseBefore(AuthMiddleware)
export class ProfileController {
  @Post()
  async createProfile(@Body() body: CreateProfileRequest): Promise<{
    cognitoSub: string | null;
    firstName?: string | null;
    lastName?: string | null;
    email: string | null;
    gender?: string | null;
    dateOfBirth?: Date | null;
    state?: string | null;
    city?: string | null;
    travelStyle?: TravelStyle[];
    preferences?: TravelPreference[];
  }> {
    const request = new CreateProfilePost(body);
    try {
      await validateOrReject(request);
    } catch (e: any) {
      throw new BadRequestError({
        description: "Validation Error",
        info: e.info,
        body: e,
      });
      // same validation error pattern as authController
    }

    try {
      return await profileManager.createProfile(body);
    } catch (e) {
      if (e instanceof ExtendedError) throw e;
      throw new InternalServerError({ description: "Something went wrong" }); // same general error pattern as authController
    }
  }

  @Put("/:cognitoSub")
  async updateProfile(
    @Param("cognitoSub") cognitoSub: string,
    @Body() body: UpdateProfileRequest,
  ) {
    const request = new UpdateProfilePost(body);

    try {
      await validateOrReject(request);
    } catch (e: any) {
      throw new BadRequestError({
        description: "Validation Error",
        body: e,
      });
    }

    try {
      return await profileManager.updateProfile(cognitoSub, body);
    } catch (e) {
      if (e instanceof ExtendedError) throw e;

      throw new InternalServerError({
        description: "Something went wrong",
      });
    }
  }
  @Delete("/:cognitoSub")
  async deleteProfile(@Param("cognitoSub") cognitoSub: string) {
    try {
      return await profileManager.deleteProfile(cognitoSub);
    } catch (e) {
      if (e instanceof ExtendedError) throw e;

      throw new InternalServerError({
        description: "Something went wrong",
      });
    }
  }
  @Get("/:cognitoSub")
  async getProfile(@Param("cognitoSub") cognitoSub: string) {
    try {
      return await profileManager.getProfile(cognitoSub);
    } catch (e) {
      if (e instanceof ExtendedError) throw e;

      throw new InternalServerError({
        description: "Something went wrong",
      });
    }
  }
}
