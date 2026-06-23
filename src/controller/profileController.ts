import { ProfileManager } from "../managers/profileManager";
import {
  Body,
  JsonController,
  Post,
  Delete,
  Put,
  Param, // Changed from Params to Param for individual path variables
  UseBefore,
  Get,
} from "routing-controllers";
import {
  CreateProfilePost,
  UpdateProfileRequest,
  UpdateProfilePost,
  CreateProfileRequest,
  ProfileResponse,
} from "../models/profileModels";
import "reflect-metadata";
import {
  BadRequestError,
  ExtendedError,
  InternalServerError,
} from "../Errors/Errors";
import { isUUID, validateOrReject } from "class-validator";
import { AuthMiddleware } from "../middleware/authMiddleware";

const profileManager = new ProfileManager();

@JsonController("/profile")
@UseBefore(AuthMiddleware)
export class ProfileController {
  @Post()
  async createProfile(
    @Body() body: CreateProfileRequest,
  ): Promise<ProfileResponse> {
    const request = new CreateProfilePost(body);
    try {
      await validateOrReject(request);
    } catch (e: any) {
      throw new BadRequestError({
        description: "Validation Error",
        info: e.info,
        body: e,
      });
    }
    try {
      return await profileManager.createProfile(body);
    } catch (e) {
      if (e instanceof ExtendedError) throw e;
      throw new InternalServerError({ description: "Something went wrong" });
    }
  }

  @Put("/:cognitosub")
  async updateProfile(
    @Param("cognitosub") cognitosub: string,
    @Body() body: UpdateProfileRequest,
  ) {
    const request = new UpdateProfilePost(body);
    try {
      isUUID(cognitosub);
      await validateOrReject(request);
    } catch (e: any) {
      throw new BadRequestError({
        description: "Validation Error",
        body: e,
      });
    }
    try {
      return await profileManager.updateProfile(cognitosub, body);
    } catch (e) {
      if (e instanceof ExtendedError) throw e;
      throw new InternalServerError({ description: "Something went wrong" });
    }
  }

  @Delete("/:cognitosub")
  async deleteProfile(@Param("cognitosub") cognitosub: string) {
    try {
      // validate cognitosub for a valid uuid
      isUUID(cognitosub);
      return await profileManager.deleteProfile(cognitosub);
    } catch (e) {
      if (e instanceof ExtendedError) throw e;
      throw new InternalServerError({ description: "Something went wrong" });
    }
  }

  @Get("/:cognitosub")
  async getProfile(@Param("cognitosub") cognitosub: string) {
    try {
      isUUID(cognitosub);
      return await profileManager.getProfile(cognitosub);
    } catch (e) {
      if (e instanceof ExtendedError) throw e;
      throw new InternalServerError({ description: "Something went wrong" });
    }
  }
}
