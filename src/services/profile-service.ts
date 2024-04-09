import { cognitoClient } from "@/libs/cognito-client";
import {
  AdminGetUserCommand,
  AdminUpdateUserAttributesCommand,
  type CognitoIdentityProviderClient,
} from "@aws-sdk/client-cognito-identity-provider";

export class ProfileService {
  private readonly cognitoPoolID = process.env.COGNITO_POOL_ID;
  private readonly client: CognitoIdentityProviderClient;

  constructor(client?: CognitoIdentityProviderClient) {
    this.client = client ?? cognitoClient;
  }

  public async getProfile(
    userId: string,
  ): Promise<Record<string, any> | undefined> {
    const command = new AdminGetUserCommand({
      UserPoolId: this.cognitoPoolID,
      Username: userId,
    });

    const { UserAttributes } = await this.client.send(command);

    const userProfile = UserAttributes?.reduce<Record<string, any>>(
      (profile, { Name, Value }) => {
        profile[String(Name)] = Value;
        return profile;
      },
      {},
    );

    return userProfile;
  }

  public async updateProfile(
    userId: string,
    profile: Record<string, any>,
  ): Promise<Record<string, any> | undefined> {
    const command = new AdminUpdateUserAttributesCommand({
      UserPoolId: this.cognitoPoolID,
      Username: userId,
      UserAttributes: Object.entries(profile).map(([Name, Value]) => ({
        Name,
        Value,
      })),
    });

    await this.client.send(command);

    const userProfile = await this.getProfile(userId);

    return userProfile;
  }
}
