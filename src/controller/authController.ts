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
import { BadRequestError } from "../Errors/Errors";
import { validateOrReject } from "class-validator";

const authManager = new AuthManager();

@JsonController("/auth")
export class AuthController {
  @Post("/create-user")
  async createUser(@Body() body: CreateUserPostRequest) {
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
    return authManager.registerUser(body);
  }

  @Post("/confirm-user")
  async confirmUser(@Body() body: ConfirmUserPostRequest) {
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
    return authManager.confirmUser(body);
  }

  @Post("/login")
  async loginUser(@Body() body: LoginPostRequest) {
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
    return authManager.loginUser(body.email, body.password);
  }

  @Post("/forgot-password")
  async forgotPassword(@Body() body: ForgotPasswordRequest) {
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
    return authManager.forgotPassword(body.email);
  }

  @Post("/confirm-forgot-password")
  async confirmForgotPassword(@Body() body: ConfirmForgotPasswordRequest) {
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
    return authManager.confirmForgotPassword(
      body.email,
      body.code,
      body.newPassword,
    );
  }
}
