import { cognitoClient } from "@/libs/cognito-client";
import { type ConfirmAccountParams } from "@/types/confirm-account-params";
import { type ResetPasswordParams } from "@/types/reset-password-params";
import { type SignInParams } from "@/types/sign-in-params";
import { type SignInResponse } from "@/types/sign-in-response";
import { type SignUpParams } from "@/types/sign-up-params";
import {
  type CognitoIdentityProviderClient,
  ConfirmForgotPasswordCommand,
  ConfirmSignUpCommand,
  ForgotPasswordCommand,
  InitiateAuthCommand,
  SignUpCommand,
} from "@aws-sdk/client-cognito-identity-provider";

export class AuthService {
  private readonly client: CognitoIdentityProviderClient;
  private readonly cognitoClientID = process.env.COGNITO_CLIENT_ID;

  constructor(client?: CognitoIdentityProviderClient) {
    this.client = client ?? cognitoClient;
  }

  public async signUp(params: SignUpParams): Promise<string | undefined> {
    const command = new SignUpCommand({
      ClientId: this.cognitoClientID,
      Username: params.phoneNumber,
      Password: params.password,
      UserAttributes: [{ Name: "name", Value: params.name }],
    });

    const { UserSub } = await this.client.send(command);

    return UserSub;
  }

  public async confirmAccount(params: ConfirmAccountParams): Promise<void> {
    const command = new ConfirmSignUpCommand({
      ClientId: this.cognitoClientID,
      Username: params.phoneNumber,
      ConfirmationCode: params.code,
    });

    await this.client.send(command);
  }

  public async signIn(params: SignInParams): Promise<SignInResponse> {
    const authFlow = {
      password: "USER_PASSWORD_AUTH",
      refreshToken: "REFRESH_TOKEN_AUTH",
    } as const;

    const authParams: Record<string, string> = {};
    switch (params.flow) {
      case "password":
        authParams.USERNAME = params.phoneNumber;
        authParams.PASSWORD = params.password;
        break;
      case "refreshToken":
        authParams.REFRESH_TOKEN = params.token;
        break;
    }

    const command = new InitiateAuthCommand({
      ClientId: this.cognitoClientID,
      AuthFlow: authFlow[params.flow],
      AuthParameters: authParams,
    });

    const { AuthenticationResult } = await this.client.send(command);

    return {
      accessToken: AuthenticationResult?.AccessToken ?? "",
      refreshToken: AuthenticationResult?.RefreshToken ?? "",
    };
  }

  public async forgotPassword(phoneNumber: string): Promise<void> {
    const command = new ForgotPasswordCommand({
      ClientId: this.cognitoClientID,
      Username: phoneNumber,
    });

    await this.client.send(command);
  }

  public async resetPassword(params: ResetPasswordParams): Promise<void> {
    const command = new ConfirmForgotPasswordCommand({
      ClientId: this.cognitoClientID,
      Username: params.phoneNumber,
      ConfirmationCode: params.code,
      Password: params.password,
    });

    await this.client.send(command);
  }
}
