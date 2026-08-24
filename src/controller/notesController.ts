import {
  Body,
  Delete,
  Get,
  JsonController,
  Param,
  Post,
  Put,
  UseBefore,
} from "routing-controllers";
import { isUUID, validateOrReject } from "class-validator";
import { NotesManager } from "../managers/notesManager";
import {
  CreateNotesPost,
  CreateNotesRequest,
  NotesResponse,
  UpdateNotesBody,
  UpdateNotesRequest,
} from "../models/notesModels";
import {
  BadRequestError,
  ExtendedError,
  InternalServerError,
} from "../Errors/Errors";
import { AuthMiddleware } from "../middleware/authMiddleware";

const notesManager = new NotesManager();

@JsonController("/notes")
@UseBefore(AuthMiddleware)
export class NotesController {
  @Post()
  async createNote(@Body() body: CreateNotesRequest): Promise<NotesResponse> {
    const request = new CreateNotesPost(body);

    try {
      await validateOrReject(request);
    } catch (e: any) {
      throw new BadRequestError({
        description: "Validation Error",
        body: e,
      });
    }

    try {
      return await notesManager.createNote(request);
    } catch (e) {
      if (e instanceof ExtendedError) {
        throw e;
      }

      throw new InternalServerError({
        description: "Something went wrong",
      });
    }
  }

  @Get("/:noteid")
  async getNote(@Param("noteid") noteId: string): Promise<NotesResponse> {
    if (!isUUID(noteId)) {
      throw new BadRequestError({
        description: "Invalid note ID",
      });
    }

    try {
      return await notesManager.getNote(noteId);
    } catch (e) {
      if (e instanceof ExtendedError) {
        throw e;
      }

      throw new InternalServerError({
        description: "Something went wrong",
      });
    }
  }

  @Get("/by-trip/:tripid")
  async getNotesByTripId(
    @Param("tripid") tripId: string,
  ): Promise<NotesResponse[]> {
    if (!isUUID(tripId)) {
      throw new BadRequestError({
        description: "Invalid trip ID",
      });
    }

    try {
      return await notesManager.getNotesByTripId(tripId);
    } catch (e) {
      if (e instanceof ExtendedError) {
        throw e;
      }

      throw new InternalServerError({
        description: "Something went wrong",
      });
    }
  }

  @Get("/by-trip/:tripid/profile/:profileid")
  async getNoteByTripAndProfile(
    @Param("tripid") tripId: string,
    @Param("profileid") profileId: string,
  ): Promise<NotesResponse> {
    if (!isUUID(tripId) || !isUUID(profileId)) {
      throw new BadRequestError({
        description: "Invalid trip ID or profile ID",
      });
    }

    try {
      return await notesManager.getNoteByTripAndProfile(tripId, profileId);
    } catch (e) {
      if (e instanceof ExtendedError) {
        throw e;
      }

      throw new InternalServerError({
        description: "Something went wrong",
      });
    }
  }

  @Put("/:noteid")
  async updateNote(
    @Param("noteid") noteId: string,
    @Body() body: UpdateNotesRequest,
  ): Promise<NotesResponse> {
    if (!isUUID(noteId)) {
      throw new BadRequestError({
        description: "Invalid note ID",
      });
    }

    const request = new UpdateNotesBody(body);

    try {
      await validateOrReject(request);
    } catch (e: any) {
      throw new BadRequestError({
        description: "Validation Error",
        body: e,
      });
    }

    try {
      return await notesManager.updateNote(noteId, request);
    } catch (e) {
      if (e instanceof ExtendedError) {
        throw e;
      }

      throw new InternalServerError({
        description: "Something went wrong",
      });
    }
  }

  @Delete("/:noteid")
  async deleteNote(
    @Param("noteid") noteId: string,
  ): Promise<{ message: string }> {
    if (!isUUID(noteId)) {
      throw new BadRequestError({
        description: "Invalid note ID",
      });
    }

    try {
      return await notesManager.deleteNote(noteId);
    } catch (e) {
      if (e instanceof ExtendedError) {
        throw e;
      }

      throw new InternalServerError({
        description: "Something went wrong",
      });
    }
  }
}
