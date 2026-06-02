import { BadRequestError, InternalServerError } from "../Errors/Errors";
import {
  SignUpCommand,
  ConfirmSignUpCommand,
  CognitoIdentityProviderClient,
  ForgotPasswordCommand,
  ConfirmForgotPasswordCommand,
  InitiateAuthCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { cognitoClient } from "../config/cognito";
import {
  ConfirmUserInput,
  CreateUserPostRequest,
} from "../models/authenticationModels";

export class AuthManager {
  async registerUser(input: CreateUserPostRequest) {
    const clientId = process.env.COGNITO_APP_CLIENT_ID;

    if (!clientId) {
      throw new InternalServerError({
        description: "Cognito client ID is missing",
      });
    }

    const command = new SignUpCommand({
      ClientId: clientId,
      Username: input.email,
      Password: input.password,
      UserAttributes: [{ Name: "email", Value: input.email }],
    });

    try {
      const response = await cognitoClient.send(command);
      return {
        userSub: response.UserSub,
        userConfirmed: response.UserConfirmed,
        codeDeliveryDetails: response.CodeDeliveryDetails,
      };
    } catch (err: any) {
      if (err.name === "UsernameExistsException") {
        throw new BadRequestError({
          description: "An account with this email already exists",
        });
      }
      if (err.name === "InvalidPasswordException") {
        throw new BadRequestError({
          description: "Password does not meet requirements",
          info: err.message,
        });
      }
      if (err.name === "InvalidParameterException") {
        throw new BadRequestError({
          description: "Invalid email or password format",
          info: err.message,
        });
      }
      throw new InternalServerError({
        description: "Failed to create user",
        info: err.message,
      });
    }
  }

  async confirmUser(input: ConfirmUserInput) {
    const clientId = process.env.COGNITO_APP_CLIENT_ID;

    if (!clientId) {
      throw new InternalServerError({
        description: "Cognito client ID is missing",
      });
    }

    const command = new ConfirmSignUpCommand({
      ClientId: clientId,
      Username: input.username,
      ConfirmationCode: input.code,
    });

    try {
      const response = await cognitoClient.send(command);
      return {
        success: response.$metadata.httpStatusCode === 200,
      };
    } catch (err: any) {
      if (err.name === "CodeMismatchException") {
        throw new BadRequestError({ description: "Invalid verification code" });
      }
      if (err.name === "ExpiredCodeException") {
        throw new BadRequestError({
          description: "Verification code has expired",
        });
      }
      if (err.name === "UserNotFoundException") {
        throw new BadRequestError({
          description: "No account found with this email",
        });
      }
      throw new InternalServerError({
        description: "Failed to confirm user",
        info: err.message,
      });
    }
  }

  async loginUser(email: string, password: string) {
    const command = new InitiateAuthCommand({
      AuthFlow: "USER_PASSWORD_AUTH",
      ClientId: process.env.COGNITO_APP_CLIENT_ID!,
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password,
      },
    });

    try {
      const response = await cognitoClient.send(command);

      if (
        response.ChallengeName === "SOFTWARE_TOKEN_MFA" ||
        response.ChallengeName === "SMS_MFA"
      ) {
        return {
          session: response.Session,
          challengeName: response.ChallengeName,
          message: "MFA code sent. Please verify.",
        };
      }

      return {
        accessToken: response.AuthenticationResult?.AccessToken,
        idToken: response.AuthenticationResult?.IdToken,
        refreshToken: response.AuthenticationResult?.RefreshToken,
        message: "Login successful",
      };
    } catch (err: any) {
      if (err.name === "NotAuthorizedException") {
        throw new BadRequestError({
          description: "Incorrect email or password",
        });
      }
      if (err.name === "UserNotConfirmedException") {
        throw new BadRequestError({
          description: "Please verify your email before logging in",
        });
      }
      if (err.name === "UserNotFoundException") {
        throw new BadRequestError({
          description: "No account found with this email",
        });
      }
      throw new InternalServerError({
        description: "Login failed",
        info: err.message,
      });
    }
  }

  async forgotPassword(email: string) {
    const command = new ForgotPasswordCommand({
      ClientId: process.env.COGNITO_APP_CLIENT_ID!,
      Username: email,
    });

    try {
      await cognitoClient.send(command);
      return { message: "Verification code sent to email" };
    } catch (err: any) {
      if (err.name === "UserNotFoundException") {
        throw new BadRequestError({
          description: "No account found with this email",
        });
      }
      if (err.name === "InvalidParameterException") {
        throw new BadRequestError({
          description: "Invalid email format",
          info: err.message,
        });
      }
      throw new InternalServerError({
        description: "Failed to send reset code",
        info: err.message,
      });
    }
  }

  async confirmForgotPassword(
    email: string,
    code: string,
    newPassword: string,
  ) {
    const command = new ConfirmForgotPasswordCommand({
      ClientId: process.env.COGNITO_APP_CLIENT_ID!,
      Username: email,
      ConfirmationCode: code,
      Password: newPassword,
    });

    try {
      await cognitoClient.send(command);
      return { message: "Password reset successful" };
    } catch (err: any) {
      if (err.name === "CodeMismatchException") {
        throw new BadRequestError({ description: "Invalid reset code" });
      }
      if (err.name === "ExpiredCodeException") {
        throw new BadRequestError({ description: "Reset code has expired" });
      }
      if (err.name === "InvalidPasswordException") {
        throw new BadRequestError({
          description: "Password does not meet requirements",
          info: err.message,
        });
      }
      throw new InternalServerError({
        description: "Failed to reset password",
        info: err.message,
      });
    }
  }
}
