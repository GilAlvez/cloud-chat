import { AuthService } from "@/services/auth-service";
import { type Handler } from "@/types/handler";
import { bodyParser } from "@/utils/body-parser";
import { response } from "@/utils/response";
import { CognitoIdentityProviderServiceException } from "@aws-sdk/client-cognito-identity-provider";

export const handler: Handler = async (event) => {
  try {
    const body = bodyParser(event.body);
    const auth = new AuthService();

    await auth.confirmAccount({
      phoneNumber: body.phone_number,
      code: body.code,
    });

    return response(204);
  } catch (error) {
    if (error instanceof CognitoIdentityProviderServiceException) {
      return response(400, { message: error.message });
    }

    throw error;
  }
};
