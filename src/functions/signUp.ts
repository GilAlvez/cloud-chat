import type { APIGatewayProxyEventV2 } from "aws-lambda";

export async function handler(event: APIGatewayProxyEventV2): Promise<any> {
  console.log(event);

  return {
    statusCode: 200,
    body: "Hello World!",
  };
}
