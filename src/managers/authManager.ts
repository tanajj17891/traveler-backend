import {
  CreateUserPoolClientCommand,
  CreateUserPoolCommand,
  DescribeUserPoolCommand,
  SignUpCommand,
  ConfirmSignUpCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { cognitoClient } from "../config/cognito";
import { RegisterUserInput } from "../models/authenticationModels";



type ConfirmUserInput = {
  username: string;
  code: string;
};

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
  }

  async createUserPoolClient(userPoolId: string) {
    const command = new CreateUserPoolClientCommand({
      UserPoolId: userPoolId,
      ClientName: "traveler-app-client",
      GenerateSecret: false,
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
  }

  async checkUserPoolExists(userPoolId: string) {
    const command = new DescribeUserPoolCommand({
      UserPoolId: userPoolId,
    });

    const response = await cognitoClient.send(command);

    return {
      exists: !!response.UserPool,
      userPool: response.UserPool,
    };
  }

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
    });

    const response = await cognitoClient.send(command);

    return {
      userSub: response.UserSub,
      userConfirmed: response.UserConfirmed,
      codeDeliveryDetails: response.CodeDeliveryDetails,
    };
  }

  async confirmUser(input: ConfirmUserInput) {
    const clientId = process.env.COGNITO_CLIENT_ID;

    if (!clientId) {
      throw new Error("COGNITO_CLIENT_ID is missing");
    }

    const command = new ConfirmSignUpCommand({
      ClientId: clientId,
      Username: input.username,
      ConfirmationCode: input.code,
    });

    const response = await cognitoClient.send(command);

    return {
      success: response.$metadata.httpStatusCode === 200,
    };
  }
}