import { AuthService } from "@/services/auth-service";
import { type Handler } from "@/types/handler";
import { bodyParser } from "@/utils/body-parser";
import { response } from "@/utils/response";
import { CognitoIdentityProviderServiceException } from "@aws-sdk/client-cognito-identity-provider";

export const handler: Handler = async (event) => {
  try {
    const body = bodyParser(event.body);
    const auth = new AuthService();

    const { accessToken, refreshToken } = await auth.signIn({
      flow: "password",
      phoneNumber: body.phone_number,
      password: body.password,
    });

    return response(200, {
      access_token: accessToken,
      refresh_token: refreshToken,
    });
  } catch (error) {
    if (error instanceof CognitoIdentityProviderServiceException) {
      return response(400, { message: error.message });
    }
    throw error;
  }
};
