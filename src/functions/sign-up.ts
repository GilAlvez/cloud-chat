import { CognitoIdentityProviderServiceException } from "@aws-sdk/client-cognito-identity-provider";

import { AuthService } from "@/services/auth-service";
import { type Handler } from "@/types/handler";
import { bodyParser } from "@/utils/body-parser";
import { response } from "@/utils/response";

export const handler: Handler = async (event) => {
  try {
    const body = bodyParser(event.body);

    const auth = new AuthService();
    const id = await auth.signUp({
      name: body.name,
      phoneNumber: body.phone_number,
      password: body.password,
    });

    return response(201, { id });
  } catch (error) {
    if (error instanceof CognitoIdentityProviderServiceException) {
      return response(400, { message: error.message });
    }

    throw error;
  }
};
