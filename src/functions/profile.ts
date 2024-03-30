import { ProfileService } from "@/services/profile-service";
import { type HandlerWithAuthorizer } from "@/types/handler-with-authorizer";
import { jwtParser } from "@/utils/jwt-parser";
import { response } from "@/utils/response";

export const handler: HandlerWithAuthorizer = async (event) => {
  try {
    const userId = jwtParser(event);

    if (userId === undefined) {
      return response(401, { message: "Unauthorized" });
    }

    const profile = new ProfileService();

    const results = await profile.getProfile(userId);

    return response(200, results);
  } catch (error) {
    console.log(error);

    throw error;
  }
};
