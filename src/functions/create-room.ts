import { ChatService } from "@/services/chat-service";
import { type CreateRoomParams } from "@/types/create-room-params";
import { type HandlerWithAuthorizer } from "@/types/handler-with-authorizer";
import { bodyParser } from "@/utils/body-parser";
import { response } from "@/utils/response";
import { DynamoDBServiceException } from "@aws-sdk/client-dynamodb";

export const handler: HandlerWithAuthorizer = async (event) => {
  try {
    const { participants } = bodyParser(event.body) as CreateRoomParams;

    if (participants === undefined || participants.length !== 2) {
      return response(400, {
        message: "Two participants are required to create a room",
      });
    }

    if (participants[0] === participants[1]) {
      return response(400, {
        message: "Two participants must be different",
      });
    }

    const chat = new ChatService();
    const params = await chat.createRoom(participants);

    return response(200, params);
  } catch (error) {
    if (error instanceof DynamoDBServiceException) {
      return response(400, { message: error.message });
    }
    throw error;
  }
};
