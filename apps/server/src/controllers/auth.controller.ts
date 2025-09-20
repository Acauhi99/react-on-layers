import { FastifyRequest, FastifyReply } from "fastify";
import { AuthService } from "../services/auth.service.js";
import { z } from "zod";

const registerSchema = z.object({
  email: z.email(),
  name: z.string().min(1),
  password: z.string().min(6),
});

const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

export class AuthController {
  private authService = new AuthService();

  async register(request: FastifyRequest, reply: FastifyReply) {
    try {
      const body = registerSchema.parse(request.body);
      const result = await this.authService.register(
        body.email,
        body.name,
        body.password
      );
      reply.status(201).send(result);
    } catch (error) {
      reply.status(400).send({ error: (error as Error).message });
    }
  }

  async login(request: FastifyRequest, reply: FastifyReply) {
    try {
      const body = loginSchema.parse(request.body);
      const result = await this.authService.login(body.email, body.password);
      reply.send(result);
    } catch (error) {
      reply.status(401).send({ error: (error as Error).message });
    }
  }
}
