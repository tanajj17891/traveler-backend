import { PrismaClient } from "@prisma/client";
import {
  BadRequestError,
  ExtendedError,
  InternalServerError,
  NotFoundError,
} from "../Errors/Errors";
import {
  NotesResponse,
  CreateNotesPost,
  UpdateNotesRequest,
} from "../models/notesModels";

const prisma = new PrismaClient();

export class NotesManager {
  async createNote(input: CreateNotesPost): Promise<NotesResponse> {
    try {
      const trip = await prisma.trip.findUnique({
        where: {
          tripId: input.tripId,
        },
      });

      if (!trip) {
        throw new NotFoundError({
          description: "Trip not found",
        });
      }

      const profile = await prisma.profile.findUnique({
        where: {
          profileId: input.profileId,
        },
      });

      if (!profile) {
        throw new NotFoundError({
          description: "Profile not found",
        });
      }

      const existingNote = await prisma.note.findUnique({
        where: {
          tripId_profileId: {
            tripId: input.tripId,
            profileId: input.profileId,
          },
        },
      });

      if (existingNote) {
        throw new BadRequestError({
          description: "A note already exists for this profile on this trip",
        });
      }

      const note = await prisma.note.create({
        data: {
          tripId: input.tripId,
          profileId: input.profileId,
          text: input.text,
        },
      });

      return new NotesResponse(note);
    } catch (e) {
      console.error("NOTE ERROR:", e);

      if (e instanceof ExtendedError) {
        throw e;
      }

      throw new InternalServerError({
        description: "Failed to create note",
      });
    }
  }

  async getNote(noteId: string): Promise<NotesResponse> {
    try {
      const note = await prisma.note.findUnique({
        where: {
          noteId,
        },
      });

      if (!note) {
        throw new NotFoundError({
          description: "Note not found",
        });
      }

      return new NotesResponse(note);
    } catch (e) {
      console.error("NOTE ERROR:", e);

      if (e instanceof ExtendedError) {
        throw e;
      }

      throw new InternalServerError({
        description: "Failed to get note",
      });
    }
  }

  async getNotesByTripId(tripId: string): Promise<NotesResponse[]> {
    try {
      const notes = await prisma.note.findMany({
        where: {
          tripId,
        },
        orderBy: {
          createdAt: "asc",
        },
      });

      return notes.map((note) => new NotesResponse(note));
    } catch (e) {
      console.error("NOTE ERROR:", e);

      if (e instanceof ExtendedError) {
        throw e;
      }

      throw new InternalServerError({
        description: "Failed to get trip notes",
      });
    }
  }

  async getNoteByTripAndProfile(
    tripId: string,
    profileId: string,
  ): Promise<NotesResponse> {
    try {
      const note = await prisma.note.findUnique({
        where: {
          tripId_profileId: {
            tripId,
            profileId,
          },
        },
      });

      if (!note) {
        throw new NotFoundError({
          description: "Note not found",
        });
      }

      return new NotesResponse(note);
    } catch (e) {
      console.error("NOTE ERROR:", e);

      if (e instanceof ExtendedError) {
        throw e;
      }

      throw new InternalServerError({
        description: "Failed to get note",
      });
    }
  }

  async updateNote(
    noteId: string,
    input: UpdateNotesRequest,
  ): Promise<NotesResponse> {
    try {
      const existingNote = await prisma.note.findUnique({
        where: {
          noteId,
        },
      });

      if (!existingNote) {
        throw new NotFoundError({
          description: "Note not found",
        });
      }

      const updatedNote = await prisma.note.update({
        where: {
          noteId,
        },
        data: input,
      });

      return new NotesResponse(updatedNote);
    } catch (e) {
      console.error("NOTE ERROR:", e);

      if (e instanceof ExtendedError) {
        throw e;
      }

      throw new InternalServerError({
        description: "Failed to update note",
      });
    }
  }

  async deleteNote(noteId: string): Promise<{ message: string }> {
    try {
      const existingNote = await prisma.note.findUnique({
        where: {
          noteId,
        },
      });

      if (!existingNote) {
        throw new NotFoundError({
          description: "Note not found",
        });
      }

      await prisma.note.delete({
        where: {
          noteId,
        },
      });

      return {
        message: "Note deleted successfully",
      };
    } catch (e) {
      console.error("NOTE ERROR:", e);

      if (e instanceof ExtendedError) {
        throw e;
      }

      throw new InternalServerError({
        description: "Failed to delete note",
      });
    }
  }
}
