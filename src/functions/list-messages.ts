import { ChatService } from "@/services/chat-service";
import { type HandlerWithAuthorizer } from "@/types/handler-with-authorizer";
import { bodyParser } from "@/utils/body-parser";
import { response } from "@/utils/response";
import { DynamoDBServiceException } from "@aws-sdk/client-dynamodb";

export const handler: HandlerWithAuthorizer = async (event) => {
  try {
    const body = bodyParser(event.body);
    const roomId = body.roomId as string;
    const chat = new ChatService();

    const data = await chat.listMessages(roomId);

    return response(200, data);
  } catch (error) {
    if (error instanceof DynamoDBServiceException) {
      return response(400, { message: error.message });
    }
    throw error;
  }
};
