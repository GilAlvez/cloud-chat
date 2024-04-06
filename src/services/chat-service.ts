import { dynamodbClient } from "@/libs/dynamodb-client";
import { PutCommand, type DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { randomUUID } from "node:crypto";

export class ChatService {
  private readonly client: DynamoDBDocumentClient;
  private readonly tableName = process.env.DYNAMODB_TABLE;
  private readonly prefix = {
    roomId: "ROOM:",
    roomKey: "INFO:",
  };

  constructor(client?: DynamoDBDocumentClient) {
    this.client = client ?? dynamodbClient;
  }

  public async createRoom(
    userIds: string[],
  ): Promise<Record<string, any> | undefined> {
    const command = new PutCommand({
      TableName: this.tableName,
      Item: {
        id: this.prefix.roomId + randomUUID(),
        key: this.prefix.roomKey,
        users: userIds,
        created_at: new Date().toISOString(),
      },
    });

    await this.client.send(command);

    return command.input.Item;
  }
}
