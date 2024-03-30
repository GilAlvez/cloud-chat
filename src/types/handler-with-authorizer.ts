import {
  type APIGatewayProxyEventV2WithJWTAuthorizer,
  type APIGatewayProxyResultV2,
} from "aws-lambda";

export type HandlerWithAuthorizer = (
  event: APIGatewayProxyEventV2WithJWTAuthorizer,
) => Promise<APIGatewayProxyResultV2>;
