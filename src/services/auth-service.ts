import { cognitoClient } from "@/libs/cognito-client";
import { type CreateUserParams } from "@/types/create-user-params";
import {
  type CognitoIdentityProviderClient,
  SignUpCommand,
} from "@aws-sdk/client-cognito-identity-provider";

export class AuthService {
  private static readonly cognitoClientID = process.env.COGNITO_CLIENT_ID;
  private readonly client: CognitoIdentityProviderClient;

  constructor(client?: CognitoIdentityProviderClient) {
    this.client = client ?? cognitoClient;
  }

  public async signUp(params: CreateUserParams): Promise<string | undefined> {
    const command = new SignUpCommand({
      ClientId: AuthService.cognitoClientID,
      Username: params.phone_number,
      Password: params.password,
      UserAttributes: [{ Name: "name", Value: params.name }],
    });

    const { UserSub } = await this.client.send(command);

    return UserSub;
  }
}
