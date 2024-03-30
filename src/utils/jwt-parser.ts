import { type APIGatewayProxyEventV2WithJWTAuthorizer } from "aws-lambda";

export function jwtParser(
  event?: APIGatewayProxyEventV2WithJWTAuthorizer,
): string | undefined {
  return event?.requestContext.authorizer.jwt.claims.sub as string;
}
