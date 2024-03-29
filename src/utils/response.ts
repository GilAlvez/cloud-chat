import { type APIGatewayProxyResultV2 } from "aws-lambda";

export function response(
  statusCode: number,
  body?: Record<string, any>,
  headers?: Record<string, string>,
): APIGatewayProxyResultV2 {
  return {
    statusCode,
    body: JSON.stringify(body),
    headers: {
      "content-type": "application/json",
      ...headers,
    },
  };
}
