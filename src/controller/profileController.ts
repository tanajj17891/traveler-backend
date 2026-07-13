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
  QueryParam,
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
    console.log(body);
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

  @Put("/:profileid")
  async updateProfile(
    @Param("profileid") profileId: string,
    @Body() body: UpdateProfileRequest,
  ) {
    const request = new UpdateProfilePost(body);
    try {
      isUUID(profileId);
      await validateOrReject(request);
    } catch (e: any) {
      throw new BadRequestError({
        description: "Validation Error",
        body: e,
      });
    }
    try {
      return await profileManager.updateProfile(profileId, body);
    } catch (e) {
      if (e instanceof ExtendedError) throw e;
      throw new InternalServerError({ description: "Something went wrong" });
    }
  }
  @Delete("/:profileid")
  async deleteProfile(@Param("profileid") profileId: string) {
    try {
      return await profileManager.deleteProfile(profileId);
    } catch (e) {
      if (e instanceof ExtendedError) throw e;
      throw new InternalServerError({ description: "Something went wrong" });
    }
  }

  // /profile?email={email}
  @Get()
  async getProfile(@QueryParam("email") email: string) {
    try {
      console.log(email);
      console.log("here");
      return await profileManager.getProfile(email);
    } catch (e) {
      if (e instanceof ExtendedError) throw e;
      throw new InternalServerError({ description: "Something went wrong" });
    }
  }
}
