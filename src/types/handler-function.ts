import {
  type APIGatewayProxyEventV2,
  type APIGatewayProxyResultV2,
} from "aws-lambda";

export type HandlerFunction = (
  event: APIGatewayProxyEventV2,
) => Promise<APIGatewayProxyResultV2>;
