import { LoginAccountUseCase } from "@/application/use-cases/login-account.use-case";
import { RegisterAccountUseCase } from "@/application/use-cases/register-account.use-case";
import { AccountRepositoryImpl } from "@/infrastructure/repositories/account.repository.impl";
import { FastifyRequest, FastifyReply } from "fastify";
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
  private accountRepository = new AccountRepositoryImpl();

  async register(request: FastifyRequest, reply: FastifyReply) {
    try {
      const body = registerSchema.parse(request.body);
      const useCase = new RegisterAccountUseCase(this.accountRepository);
      const result = await useCase.execute(body);
      reply.status(201).send(result);
    } catch (error) {
      reply.status(400).send({ error: (error as Error).message });
    }
  }

  async login(request: FastifyRequest, reply: FastifyReply) {
    try {
      const body = loginSchema.parse(request.body);
      const useCase = new LoginAccountUseCase(this.accountRepository);
      const result = await useCase.execute(body);
      reply.send(result);
    } catch (error) {
      reply.status(401).send({ error: (error as Error).message });
    }
  }
}
