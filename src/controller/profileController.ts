import { ProfileManager } from "../managers/profileManager";
import {
  Body,
  JsonController,
  Post,
  Delete,
  Put,
  Params,
  UseBefore,
  Get,
} from "routing-controllers";
import {
  CreateProfilePost,
  UpdateProfileRequest,
  UpdateProfilePost,
  CreateProfileRequest,
  ProfileResponse,
  ProfileParams,
} from "../models/profileModels";
import "reflect-metadata";
import {
  BadRequestError,
  ExtendedError,
  InternalServerError,
} from "../Errors/Errors";
import { validateOrReject } from "class-validator";
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
      // same validation error pattern as authController
    }

    try {
      return await profileManager.createProfile(body);
    } catch (e) {
      if (e instanceof ExtendedError) throw e;
      throw new InternalServerError({ description: "Something went wrong" }); // same general error pattern as authController
    }
  }

  @Put("/:cognitosub")
  async updateProfile(
    @Params() Params: ProfileParams,
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
      return await profileManager.updateProfile(Params.cognitoSub, body);
    } catch (e) {
      if (e instanceof ExtendedError) throw e;

      throw new InternalServerError({
        description: "Something went wrong",
      });
    }
  }
  @Delete("/:cognitosub")
  async deleteProfile(@Params() Params: ProfileParams) {
    try {
      return await profileManager.deleteProfile(Params.cognitoSub);
    } catch (e) {
      if (e instanceof ExtendedError) throw e;

      throw new InternalServerError({
        description: "Something went wrong",
      });
    }
  }
  @Get("/:cognitosub")
  async getProfile(@Params() Params: ProfileParams) {
    try {
      return await profileManager.getProfile(Params.cognitoSub);
    } catch (e) {
      if (e instanceof ExtendedError) throw e;

      throw new InternalServerError({
        description: "Something went wrong",
      });
    }
  }
}
