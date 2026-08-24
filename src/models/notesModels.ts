import { IsNumber, IsOptional, IsUUID, Min } from "class-validator";

export type CreateNotesRequest = {
  profileId: string;
  tripId: string;
  text: string;
};

export type UpdateNotesRequest = {
  profileId?: string;
  tripId?: string;
  text?: string;
};

export class CreateNotesPost {
  @IsUUID()
  tripId: string;

  @IsUUID()
  profileId: string;

  text: string;

  constructor(data: CreateNotesRequest) {
    this.tripId = data.tripId;
    this.profileId = data.profileId;
    this.text = data.text;
  }
}

export class UpdateNotesBody {
  text: string;

  constructor(data: UpdateNotesRequest) {
    this.text = data.text ?? "";
  }
}

export class NotesResponse {
  noteId: string;
  tripId: string;
  profileId: string;
  createdAt: Date;
  updatedAt: Date;
  text: string;

  constructor(data: Partial<NotesResponse>) {
    this.noteId = data.noteId ?? "";
    this.tripId = data.tripId ?? "";
    this.profileId = data.profileId ?? "";
    this.createdAt = data.createdAt ?? new Date();
    this.updatedAt = data.updatedAt ?? new Date();
    this.text = data.text ?? "";
  }
}
