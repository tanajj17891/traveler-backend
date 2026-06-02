import * as httpStatus from "http-status";
import * as Rest from "typescript-rest"; // Base error class that comes with ts-rest, adds a status code property to the standard JS error class, as Rest is required because it cant import just errors from TS-rest

export abstract class ExtendedError extends Rest.Errors.HttpError {
  statusCode: number; // extendederror is an error that also has a status code
  constructor(
    name: string,
    statusCode: number,
    description: string,
    public info?: string,
    public body?: any,
  ) {
    super(name, description);
    this.statusCode = statusCode;
  }
}

interface ErrorParams {
  description: string;
  info?: string;
  body?: any;
}

export class BadRequestError extends ExtendedError {
  constructor({ description, info, body }: ErrorParams) {
    super(
      "BadRequestError",
      httpStatus.BAD_REQUEST as number,
      description,
      info,
      body,
    );
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }
}

export class NotFoundError extends ExtendedError {
  constructor({ description, info, body }: ErrorParams) {
    super(
      "NotFoundError",
      httpStatus.NOT_FOUND as number,
      description,
      info,
      body,
    );
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

export class InternalServerError extends ExtendedError {
  constructor({ description, info, body }: ErrorParams) {
    super(
      "InternalServerError",
      httpStatus.INTERNAL_SERVER_ERROR as number,
      description,
      info,
      body,
    );
    Object.setPrototypeOf(this, InternalServerError.prototype);
  }
}

export class NotImplementedError extends ExtendedError {
  constructor({ description, info, body }: ErrorParams) {
    super(
      "NotImplementedError",
      httpStatus.NOT_IMPLEMENTED as number,
      description,
      info,
      body,
    );
    Object.setPrototypeOf(this, NotImplementedError.prototype);
  }
}

export class AcceptedError extends ExtendedError {
  constructor({ description, info, body }: ErrorParams) {
    super("Accepted", httpStatus.ACCEPTED as number, description, info, body);
    Object.setPrototypeOf(this, AcceptedError.prototype);
  }
}
