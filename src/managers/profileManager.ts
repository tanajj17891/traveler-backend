import { PrismaClient } from "@prisma/client";
import {
  BadRequestError,
  InternalServerError,
  ExtendedError,
  NotFoundError,
} from "../Errors/Errors";
import {
  CreateProfileRequest,
  UpdateProfileRequest,
  type ProfileResponse,
} from "../models/profileModels";

const prisma = new PrismaClient();

export class ProfileManager {
  async createProfile(input: CreateProfileRequest) {
    try {
      const existing = await prisma.profile.findUnique({
        where: { cognitoSub: input.cognitoSub },
      });

      if (existing) {
        throw new BadRequestError({
          description: "Profile already exists for this user",
        });
      }

      const profile = await prisma.profile.create({
        data: input,
      });

      return profile;
    } catch (e) {
      console.error("PROFILE ERROR:", e);
      if (e instanceof ExtendedError) throw e;
      throw new InternalServerError({
        description: "Failed to create profile",
      });
    }
  }

  async getProfile(email: string) {
    try {
      const profile = await prisma.profile.findUnique({
        where: { email },
      });

      if (!profile) {
        throw new NotFoundError({ description: "Profile not found" });
      }
      return profile;
    } catch (e) {
      {
        if (e instanceof ExtendedError) throw e;
        throw new InternalServerError({
          description: "Failed to get profile",
        });
      }
    }
  }

  async updateProfile(profileId: string, input: UpdateProfileRequest) {
    try {
      const profile = await prisma.profile.findUnique({
        where: { profileId },
      });

      if (!profile) {
        throw new NotFoundError({ description: "Profile not found" });
      }
      const updated = await prisma.profile.update({
        where: { profileId },
        data: input,
      });

      return updated;
    } catch (e) {
      if (e instanceof ExtendedError) throw e;
      throw new InternalServerError({
        description: "Failed to update profile",
      });
    }
  }
  async deleteProfile(profileId: string) {
    try {
      const profile = await prisma.profile.findUnique({
        where: { profileId: profileId },
      });

      if (!profile) {
        throw new NotFoundError({ description: "Profile not found" });
      }

      await prisma.profile.delete({
        where: { profileId: profileId },
      });

      return { message: "Profile deleted successfully" };
    } catch (e) {
      if (e instanceof ExtendedError) throw e;
      throw new InternalServerError({
        description: "Failed to delete profile",
      });
    }
  }
  async getProfileById(profileId: string): Promise<ProfileResponse> {
    try {
      console.log("Searching for profile ID:", profileId);
      const profile = await prisma.profile.findUnique({
        where: {
          profileId,
        },
      });

      if (!profile) {
        throw new NotFoundError({
          description: `Profile not found for ID: ${profileId}`,
        });
      }

      return profile;
    } catch (e) {
      if (e instanceof ExtendedError) {
        throw e;
      }

      throw new InternalServerError({
        description: "Failed to get profile",
      });
    }
  }
}
