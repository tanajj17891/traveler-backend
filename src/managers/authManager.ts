import {
  CreateUserPoolClientCommand,
  CreateUserPoolCommand,
  DescribeUserPoolCommand,
  SignUpCommand,
  ConfirmSignUpCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { cognitoClient } from "../config/cognito";
import {
  ConfirmUserInput,
  CreateUserPostRequest,
} from "../models/authenticationModels";
import {
  InitiateAuthCommand,
  RespondToAuthChallengeCommand,
} from "@aws-sdk/client-cognito-identity-provider";

import {
  CognitoIdentityProviderClient,
  ForgotPasswordCommand,
  ConfirmForgotPasswordCommand,
} from "@aws-sdk/client-cognito-identity-provider";

const client = new CognitoIdentityProviderClient({
  region: process.env.COGNITO_REGION,
});

export class AuthManager {
  async registerUser(input: CreateUserPostRequest) {
    const clientId = process.env.COGNITO_APP_CLIENT_ID;

    if (!clientId) {
      throw new Error("COGNITO_CLIENT_ID is missing");
    }
    console.log("input", input);

    const command = new SignUpCommand({
      ClientId: clientId,
      Username: input.email, // using email as username
      Password: input.password,
      UserAttributes: [
        {
          Name: "email",
          Value: input.email,
        },
      ],
    }); // registers the user

    const response = await cognitoClient.send(command); // send this instructions to aws , wait for the answer then store it

    return {
      userSub: response.UserSub,
      userConfirmed: response.UserConfirmed,
      codeDeliveryDetails: response.CodeDeliveryDetails,
    };
  } // filters down the 3 things i actually need for my frontend

  async confirmUser(input: ConfirmUserInput) {
    // // Confirms the user's account by verifying the 6-digit code sent to their email
    const clientId = process.env.COGNITO_APP_CLIENT_ID;

    if (!clientId) {
      throw new Error("COGNITO_CLIENT_ID is missing");
    }

    const command = new ConfirmSignUpCommand({
      ClientId: clientId, // which app the request is coming from
      Username: input.username, // which user is being confirmed
      ConfirmationCode: input.code, //the info they entered
    }); //

    const response = await cognitoClient.send(command);

    return {
      success: response.$metadata.httpStatusCode === 200, //checking if the request works
    };
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

    const response = await cognitoClient.send(command);

    // If MFA is required, Cognito returns a session + challenge
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

    // If no MFA configured, returns tokens directly
    return {
      accessToken: response.AuthenticationResult?.AccessToken,
      idToken: response.AuthenticationResult?.IdToken,
      refreshToken: response.AuthenticationResult?.RefreshToken,
      message: "Login successful",
    };
  }
  async forgotPassword(email: string) {
    const forgotPasswordRequest = new ForgotPasswordCommand({
      ClientId: process.env.COGNITO_APP_CLIENT_ID!,
      Username: email,
    }); // Defines an async function that takes the user's email as input, creates an AWS Cognito command object that says "I want to trigger a forgot password flow, tells cognito which app is making the request, email tells them which user forgot their passwqord

    await client.send(forgotPasswordRequest);
    return { message: "Verification code sent to email" };
  } // sends command and then user waits for the verification code

  async confirmForgotPassword(
    // takes 3 inputs from user so they can change their password
    email: string,
    code: string,
    newPassword: string,
  ) {
    const confirmPasswordRequest = new ConfirmForgotPasswordCommand({
      // cognito command that says i want to confirm password reset
      ClientId: process.env.COGNITO_APP_CLIENT_ID!, //identifies app to cognito
      Username: email,
      ConfirmationCode: code,
      Password: newPassword,
    });

    await client.send(confirmPasswordRequest); //aws gets the command, verifies the code and updates the password
    return { message: "Password reset successful" };
  }
}
