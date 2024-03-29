import { cognitoClient } from "@/libs/cognito-client";
import { type ConfirmAccountParams } from "@/types/confirm-account-params";
import { type CreateUserParams } from "@/types/create-user-params";
import {
  type CognitoIdentityProviderClient,
  ConfirmSignUpCommand,
  SignUpCommand,
} from "@aws-sdk/client-cognito-identity-provider";

export class AuthService {
  private readonly cognitoClientID = process.env.COGNITO_CLIENT_ID;
  private readonly client: CognitoIdentityProviderClient;

  constructor(client?: CognitoIdentityProviderClient) {
    this.client = client ?? cognitoClient;
  }

  public async signUp(params: CreateUserParams): Promise<string | undefined> {
    const command = new SignUpCommand({
      ClientId: this.cognitoClientID,
      Username: params.phone_number,
      Password: params.password,
      UserAttributes: [{ Name: "name", Value: params.name }],
    });

    const { UserSub } = await this.client.send(command);

    return UserSub;
  }

  public async confirmAccount(params: ConfirmAccountParams): Promise<void> {
    const command = new ConfirmSignUpCommand({
      ClientId: this.cognitoClientID,
      Username: params.phone_number,
      ConfirmationCode: params.code,
    });

    await this.client.send(command);
  }
}
