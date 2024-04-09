import { ProfileService } from "@/services/profile-service";
import { type HandlerWithAuthorizer } from "@/types/handler-with-authorizer";
import { bodyParser } from "@/utils/body-parser";
import { jwtParser } from "@/utils/jwt-parser";
import { response } from "@/utils/response";
import { CognitoIdentityProviderServiceException } from "@aws-sdk/client-cognito-identity-provider";

export const handler: HandlerWithAuthorizer = async (event) => {
  try {
    const userId = jwtParser(event);
    const body = bodyParser(event.body);

    if (userId === undefined) {
      return response(401, { message: "Unauthorized" });
    }

    const profile = new ProfileService();

    const results = await profile.updateProfile(userId, body);

    return response(200, results);
  } catch (error) {
    if (error instanceof CognitoIdentityProviderServiceException) {
      return response(400, { message: error.message });
    }

    throw error;
  }
};
