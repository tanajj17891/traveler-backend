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

  async getProfile(cognitoSub: string) {
    try {
      const profile = await prisma.profile.findUnique({
        where: { cognitoSub },
      });
      if (!profile) {
        throw new NotFoundError({ description: "Profile not found" });
      }
      return profile;
    } catch (e) {
      {
        if (e instanceof ExtendedError) throw e;
        throw new InternalServerError({
          description: "Failed to create profile",
        });
      }
    }
  }

  async updateProfile(cognitoSub: string, input: UpdateProfileRequest) {
    try {
      const profile = await prisma.profile.findUnique({
        where: { cognitoSub },
      });
      if (!profile) {
        throw new NotFoundError({ description: "Profile not found" });
      }
      const updated = await prisma.profile.update({
        where: { cognitoSub },
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
  async deleteProfile(cognitoSub: string) {
    try {
      const profile = await prisma.profile.findUnique({
        where: { cognitoSub },
      });

      if (!profile) {
        throw new NotFoundError({ description: "Profile not found" });
      }

      await prisma.profile.delete({
        where: { cognitoSub },
      });

      return { message: "Profile deleted successfully" };
    } catch (e) {
      if (e instanceof ExtendedError) throw e;
      throw new InternalServerError({
        description: "Failed to delete profile",
      });
    }
  }
}
