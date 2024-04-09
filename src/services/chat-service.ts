import { dynamodbClient } from "@/libs/dynamodb-client";
import { type CreateMessageParams } from "@/types/create-message-params";
import {
  PutCommand,
  QueryCommand,
  ScanCommand,
  type DynamoDBDocumentClient,
} from "@aws-sdk/lib-dynamodb";
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

  public async listRooms(): Promise<Array<Record<string, any>> | undefined> {
    const command = new ScanCommand({
      TableName: this.tableName,
      FilterExpression: "begins_with(pk, #RoomPK) AND begins_with(sk, #RoomSK)",
      ExpressionAttributeValues: {
        "#RoomPK": this.prefix.RoomPK,
        "#RoomSK": this.prefix.RoomSK,
      },
    });

    const { Items } = await this.client.send(command);

    return Items;
  }

  public async createMessage({
    roomId,
    authorId,
    type,
    data,
  }: CreateMessageParams): Promise<Record<string, any> | undefined> {
    const createdAt = new Date().toISOString();

    const command = new PutCommand({
      TableName: this.tableName,
      Item: {
        pk: this.prefix.RoomPK + roomId,
        sk: this.prefix.MessageSK + createdAt,
        authorId,
        type,
        data,
        createdAt,
      },
    });

    await this.client.send(command);

    return command.input.Item;
  }

  public async listMessages(
    roomId: string,
  ): Promise<Array<Record<string, any>> | undefined> {
    const command = new QueryCommand({
      TableName: this.tableName,
      KeyConditionExpression: "pk = #RoomPK AND begins_with(sk, #MessageSK)",
      ExpressionAttributeValues: {
        "#RoomPK": this.prefix.RoomPK + roomId,
        "#MessageSK": this.prefix.MessageSK,
      },
      ScanIndexForward: false,
    });

    const { Items } = await this.client.send(command);

    return Items;
  }
}
