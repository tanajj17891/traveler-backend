import { Request, Response } from "express";
import { AuthManager } from "../managers/authManager";
import { Body, Controller, JsonController, Post } from "routing-controllers";
import {
  ConfirmUserPostRequest,
  CreateUserPostRequest,
  LoginPostRequest,
  forgotPasswordRequest,
  ConfirmForgotPasswordRequest,
} from "../models/authenticationModels";
import "reflect-metadata";
import { ForgotPasswordRequest } from "@aws-sdk/client-cognito-identity-provider";

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
  forgotPassword(@Body() body: forgotPasswordRequest) {
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
