import { AuthManager } from "../managers/authManager";
import { Body, JsonController, Post } from "routing-controllers";
import {
  CreateUserPostRequest,
  CreateUserPost,
  ConfirmUserPostRequest,
  ConfirmUserPost,
  LoginPostRequest,
  LoginPost,
  ForgotPasswordRequest,
  ForgotPasswordPost,
  ConfirmForgotPasswordRequest,
  ConfirmForgotPasswordPost,
} from "../models/authenticationModels";
import "reflect-metadata";
import {
  BadRequestError,
  ExtendedError,
  InternalServerError,
} from "../Errors/Errors";
import { validateOrReject } from "class-validator";

const authManager = new AuthManager();

@JsonController("/auth")
export class AuthController {
  @Post("/create-user")
  async createUser(@Body() body: CreateUserPostRequest): Promise<object> {
    //tells TS explicitly that the function will eventually return an object just not immediately
    const request = new CreateUserPost(body);
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
      return await authManager.registerUser(body);
    } catch (e) {
      if (e instanceof ExtendedError) throw e;
      throw new InternalServerError({ description: "Something went wrong" });
    }
  }

  @Post("/confirm-user")
  async confirmUser(@Body() body: ConfirmUserPostRequest): Promise<object> {
    const request = new ConfirmUserPost(body);
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
      return authManager.confirmUser(body);
    } catch (e) {
      if (e instanceof ExtendedError) throw e;
      throw new InternalServerError({ description: "Something went wrong" });
    }
  }

  @Post("/login")
  async loginUser(@Body() body: LoginPostRequest): Promise<object> {
    const request = new LoginPost(body);
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
      return authManager.loginUser(body.email, body.password);
    } catch (e) {
      if (e instanceof ExtendedError) throw e;
      throw new InternalServerError({ description: "Something went wrong" });
    }
  }

  @Post("/forgot-password")
  async forgotPassword(@Body() body: ForgotPasswordRequest): Promise<object> {
    const request = new ForgotPasswordPost(body);
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
      return authManager.forgotPassword(body.email);
    } catch (e) {
      if (e instanceof ExtendedError) throw e;
      throw new InternalServerError({ description: "Something went wrong" });
    }
  }

  @Post("/confirm-forgot-password")
  async confirmForgotPassword(
    @Body() body: ConfirmForgotPasswordRequest,
  ): Promise<object> {
    const request = new ConfirmForgotPasswordPost(body);
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
      return authManager.confirmForgotPassword(
        body.email,
        body.code,
        body.newPassword,
      );
    } catch (e) {
      if (e instanceof ExtendedError) throw e;
      throw new InternalServerError({ description: "Something went wrong" });
    }
  }
}
