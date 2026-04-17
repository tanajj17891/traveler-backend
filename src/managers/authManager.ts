import {
  CreateUserPoolClientCommand,
  CreateUserPoolCommand,
  DescribeUserPoolCommand,
  SignUpCommand,
  ConfirmSignUpCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { cognitoClient } from "../config/cognito";
import { RegisterUserInput } from "../models/authenticationModels";
import {
  InitiateAuthCommand,
  RespondToAuthChallengeCommand,
} from "@aws-sdk/client-cognito-identity-provider";




type ConfirmUserInput = {
  username: string;
  code: string;
}; // creates my cognito user pool, we're running this once to set things up. 

export class AuthManager {
  async createUserPool() {
    const command = new CreateUserPoolCommand({
      PoolName: "traveler-user-pool",
      AutoVerifiedAttributes: ["email"],
      UsernameAttributes: ["email"],
      Schema: [
        {
          Name: "email",
          Required: true,
          Mutable: true,
        },
      ],
      VerificationMessageTemplate: {
        DefaultEmailOption: "CONFIRM_WITH_CODE",
      },
    });

    const response = await cognitoClient.send(command);

    return {
      userPoolId: response.UserPool?.Id,
      userPoolArn: response.UserPool?.Arn,
      userPoolName: response.UserPool?.Name,
    };
  } // // Creates a new Cognito User Pool with email as username and sends a 6-digit verification code on signup
 
  async createUserPoolClient(userPoolId: string) { // creates an app client which lets the backend talk to my user pool
    const command = new CreateUserPoolClientCommand({
      UserPoolId: userPoolId,
      ClientName: "traveler-app-client",
      GenerateSecret: false, // this needs to be false to continue using sdk on my backend, true would have broken it
      ExplicitAuthFlows: [
        "ALLOW_USER_PASSWORD_AUTH",
        "ALLOW_USER_SRP_AUTH",
        "ALLOW_REFRESH_TOKEN_AUTH",
      ],
    });

    const response = await cognitoClient.send(command);

    return {
      clientId: response.UserPoolClient?.ClientId,
      clientName: response.UserPoolClient?.ClientName,
    };
  } // // Creates an app client for the User Pool, enabling password and token-based auth flows

  async checkUserPoolExists(userPoolId: string) {
    const command = new DescribeUserPoolCommand({
      UserPoolId: userPoolId,
    });

    const response = await cognitoClient.send(command);

    return {
      exists: !!response.UserPool,
      userPool: response.UserPool,
    };
  } // checks if the user pool already exists 

  async registerUser(input: RegisterUserInput) {
    const clientId = process.env.COGNITO_APP_CLIENT_ID;

    if (!clientId) {
      throw new Error("COGNITO_CLIENT_ID is missing");
    }
    console.log('input', input)

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
  } // filters down the 3 things iu actually need for my frontend 

  async confirmUser(input: ConfirmUserInput) { // // Confirms the user's account by verifying the 6-digit code sent to their email
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
  if (response.ChallengeName === "SOFTWARE_TOKEN_MFA" || 
      response.ChallengeName === "SMS_MFA") {
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

async verifyLoginMfa(session: string, mfaCode: string, email: string) {
  const command = new RespondToAuthChallengeCommand({
    ClientId: process.env.COGNITO_APP_CLIENT_ID!,
    ChallengeName: "SMS_MFA", // or "SOFTWARE_TOKEN_MFA"
    Session: session,
    ChallengeResponses: {
      USERNAME: email,
      SMS_MFA_CODE: mfaCode,
    },
  });

  const response = await cognitoClient.send(command);

  return {
    accessToken: response.AuthenticationResult?.AccessToken,
    idToken: response.AuthenticationResult?.IdToken,
    refreshToken: response.AuthenticationResult?.RefreshToken,
    message: "You have logged in successfully!",
  };
}
}