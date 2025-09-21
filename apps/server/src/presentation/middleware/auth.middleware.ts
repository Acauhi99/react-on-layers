import { AuthDomainService } from "@/domain/services/auth.domain-service";
import { FastifyRequest, FastifyReply } from "fastify";

declare module "fastify" {
  interface FastifyRequest {
    accountId?: string;
  }
}

export async function authMiddleware(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return reply
        .status(401)
        .send({ error: "Missing or invalid authorization header" });
    }

    const token = authHeader.substring(7);
    const decoded = AuthDomainService.verifyToken(token);

    request.accountId = decoded.accountId;
  } catch (error) {
    return reply.status(401).send({ error: "Invalid token" });
  }
}
