import { dynamodbClient } from "@/libs/dynamodb-client";
import { PutCommand, type DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { randomUUID } from "node:crypto";

export class ChatService {
  private readonly client: DynamoDBDocumentClient;
  private readonly tableName = process.env.DYNAMODB_TABLE;
  private readonly prefix = {
    RoomPK: "Room:",
    RoomSK: "Metadata:",
    MessageSK: "Message:",
  };

  constructor(client?: DynamoDBDocumentClient) {
    this.client = client ?? dynamodbClient;
  }

  public async createRoom(
    participants: [string, string],
  ): Promise<Record<string, any> | undefined> {
    const command = new PutCommand({
      TableName: this.tableName,
      Item: {
        pk: this.prefix.RoomPK + randomUUID(),
        sk: this.prefix.RoomSK,
        participants,
        created_at: new Date().toISOString(),
      },
    });

    await this.client.send(command);

    return command.input.Item;
  }
}
