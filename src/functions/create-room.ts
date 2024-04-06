import { ChatService } from "@/services/chat-service";
import { type HandlerWithAuthorizer } from "@/types/handler-with-authorizer";
import { bodyParser } from "@/utils/body-parser";
import { response } from "@/utils/response";
import { DynamoDBServiceException } from "@aws-sdk/client-dynamodb";

export const handler: HandlerWithAuthorizer = async (event) => {
  try {
    const body = bodyParser(event.body);
    const userIds: string[] = body.user_ids;

    if (userIds === undefined || userIds.length === 0) {
      return response(400, { message: "Parameter user_ids is required" });
    }

    const chat = new ChatService();
    const params = await chat.createRoom(userIds);

    return response(200, params);
  } catch (error) {
    if (error instanceof DynamoDBServiceException) {
      return response(400, { message: error.message });
    }
    throw error;
  }
};
