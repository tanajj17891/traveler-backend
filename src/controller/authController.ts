import { AuthManager } from "../managers/authManager";
import { Body, JsonController, Post } from "routing-controllers";
import {
  ConfirmUserPostRequest,
  CreateUserPostRequest,
  LoginPostRequest,
  ForgotPasswordRequest,
  ConfirmForgotPasswordRequest,
} from "../models/authenticationModels";
import "reflect-metadata";

const authManager = new AuthManager();

@JsonController("/auth")
export class AuthController {
  @Post("/create-user")
  createUser(@Body() body: CreateUserPostRequest) {
    console.log("body", body);
    return authManager.registerUser(body);
  }

  @Post("/confirm-user")
  confirmUser(@Body() body: ConfirmUserPostRequest) {
    return authManager.confirmUser(body);
  }
  @Post("/login")
  loginUser(@Body() body: LoginPostRequest) {
    return authManager.loginUser(body.email, body.password);
  }
  @Post("/forgot-password")
  forgotPassword(@Body() body: ForgotPasswordRequest) {
    return authManager.forgotPassword(body.email);
  }

  @Post("/confirm-forgot-password")
  confirmForgotPassword(@Body() body: ConfirmForgotPasswordRequest) {
    return authManager.confirmForgotPassword(
      body.email,
      body.code,
      body.newPassword,
    );
  }
}
