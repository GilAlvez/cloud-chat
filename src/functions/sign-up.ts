import { CognitoIdentityProviderServiceException } from "@aws-sdk/client-cognito-identity-provider";
import {
  type APIGatewayProxyEventV2,
  type APIGatewayProxyResultV2,
} from "aws-lambda";

import { AuthService } from "@/services/auth-service";
import { bodyParser } from "@/utils/body-parser";
import { response } from "@/utils/response";

export async function handler(
  event: APIGatewayProxyEventV2,
): Promise<APIGatewayProxyResultV2> {
  try {
    const body = bodyParser(event.body);

    const auth = new AuthService();
    const id = await auth.signUp({
      name: body.name,
      phone_number: body.phone_number,
      password: body.password,
    });

    return response(201, { id });
  } catch (error) {
    if (error instanceof CognitoIdentityProviderServiceException) {
      return response(400, { message: error.message });
    }

    throw error;
  }
}
