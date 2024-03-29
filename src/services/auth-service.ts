import { cognitoClient } from "@/libs/cognito-client";
import { type ConfirmAccountParams } from "@/types/confirm-account-params";
import { type SignInParams } from "@/types/sign-in-params";
import { type SignInResponse } from "@/types/sign-in-response";
import { type SignUpParams } from "@/types/sign-up-params";
import {
  type CognitoIdentityProviderClient,
  ConfirmSignUpCommand,
  InitiateAuthCommand,
  SignUpCommand,
} from "@aws-sdk/client-cognito-identity-provider";

export class AuthService {
  private readonly cognitoClientID = process.env.COGNITO_CLIENT_ID;
  private readonly client: CognitoIdentityProviderClient;

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
    const command = new InitiateAuthCommand({
      ClientId: this.cognitoClientID,
      AuthFlow: "USER_PASSWORD_AUTH",
      AuthParameters: {
        USERNAME: params.phoneNumber,
        PASSWORD: params.password,
      },
    });

    const { AuthenticationResult } = await this.client.send(command);

    return {
      accessToken: AuthenticationResult?.AccessToken ?? "",
      refreshToken: AuthenticationResult?.RefreshToken ?? "",
    };
  }
}
