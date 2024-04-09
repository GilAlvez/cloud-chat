import { ChatService } from "@/services/chat-service";
import { type CreateMessageParams } from "@/types/create-message-params";
import { type HandlerWithAuthorizer } from "@/types/handler-with-authorizer";
import { bodyParser } from "@/utils/body-parser";
import { response } from "@/utils/response";
import { DynamoDBServiceException } from "@aws-sdk/client-dynamodb";

export const handler: HandlerWithAuthorizer = async (event) => {
  try {
    const body = bodyParser(event.body) as CreateMessageParams;

    const chat = new ChatService();
    const message = await chat.createMessage(body);

    return response(200, message);
  } catch (error) {
    if (error instanceof DynamoDBServiceException) {
      return response(400, { message: error.message });
    }
    throw error;
  }
};
