import { FastifyRequest, FastifyReply } from "fastify";
import { AuthService } from "../services/auth.service.js";

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
    const authService = new AuthService();
    const decoded = authService.verifyToken(token);

    request.accountId = decoded.accountId;
  } catch (error) {
    return reply.status(401).send({ error: "Invalid token" });
  }
}
