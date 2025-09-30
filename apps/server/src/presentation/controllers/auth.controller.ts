import { LoginAccountUseCase } from "@/application/use-cases/login-account.use-case";
import { RegisterAccountUseCase } from "@/application/use-cases/register-account.use-case";
import { AccountRepositoryImpl } from "@/infrastructure/repositories/account.repository.impl";
import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { BaseController } from "./base.controller";

const registerSchema = z.object({
  email: z.email("Email inválido"),
  name: z.string().min(1, "Nome é obrigatório"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
});

const loginSchema = z.object({
  email: z.email("Email inválido"),
  password: z.string().min(1, "Senha é obrigatória"),
});

const authSchema = z.object({
  action: z.enum(["login", "register"]),
  email: z.email("Email inválido"),
  password: z.string().min(1, "Senha é obrigatória"),
  name: z.string().min(1, "Nome é obrigatório").optional(),
});

export class AuthController extends BaseController {
  private readonly accountRepository = new AccountRepositoryImpl();

  async register(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    await this.handleRequest(
      request,
      reply,
      registerSchema,
      async (data) => {
        const useCase = new RegisterAccountUseCase(this.accountRepository);
        return useCase.execute(data);
      },
      201
    );
  }

  async login(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    await this.handleRequest(request, reply, loginSchema, async (data) => {
      const useCase = new LoginAccountUseCase(this.accountRepository);
      return useCase.execute(data);
    });
  }

  async auth(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    await this.handleRequest(request, reply, authSchema, async (data) => {
      if (data.action === "register") {
        if (!data.name) {
          throw new Error("Nome é obrigatório para registro");
        }
        const useCase = new RegisterAccountUseCase(this.accountRepository);
        const result = await useCase.execute({
          email: data.email,
          name: data.name,
          password: data.password,
        });
        reply.status(201);
        return result;
      } else {
        const useCase = new LoginAccountUseCase(this.accountRepository);
        return useCase.execute({
          email: data.email,
          password: data.password,
        });
      }
    });
  }
}
