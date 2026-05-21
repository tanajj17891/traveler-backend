import {
  ExpressErrorMiddlewareInterface,
  Middleware,
} from "routing-controllers";
import { Request, Response, NextFunction } from "express";
import { ExtendedError } from "../Errors/Errors";

@Middleware({ type: "after" }) // Registers the class as middleware, type: 'after' means: run AFTER controllers/routes
export class ErrorMiddleware implements ExpressErrorMiddlewareInterface {
  // implements ExpressErrorMiddlewareInterface means this class MUST contain an error() method
  error(error: any, req: Request, res: Response, next: NextFunction) {
    // error - the thrown error, req - request object, res - response object, next - move to next middleware
    if (error instanceof ExtendedError) {
      // checks if this is one of my custom errors

      // If the body is a class-validator error array, extract just the messages
      let data = error.body ?? {};
      if (Array.isArray(error.body)) {
        data = error.body.flatMap((e: any) =>
          Object.values(e.constraints ?? {}),
        );
      }

      return res.status(error.statusCode).json({
        error: {
          description: error.message, // human readable error message
          data, // either cleaned up validation messages or the raw error body
        },
      });
    }

    // Fallback for any unexpected errors that aren't custom ExtendedErrors
    console.error("Unhandled error:", error);
    return res.status(500).json({
      error: {
        description: "An unexpected error occurred",
        data: {},
      },
    });
  }
}
