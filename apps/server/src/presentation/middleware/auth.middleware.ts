import { AuthDomainService } from "@/domain/services/auth.domain-service";
import { FastifyRequest, FastifyReply } from "fastify";

declare module "fastify" {
  interface FastifyRequest {
    user?: {
      accountId: string;
      email: string;
      name: string;
    };
  }
}

export async function authMiddleware(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const authHeader = request.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return reply
      .status(401)
      .send({ error: "Missing or invalid authorization header" });
  }

  const token = authHeader.substring(7);
  const decoded = AuthDomainService.verifyToken(token);

  request.user = {
    accountId: decoded.accountId,
    email: decoded.email,
    name: decoded.name,
  };
}
