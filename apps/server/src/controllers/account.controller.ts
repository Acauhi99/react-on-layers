import { FastifyRequest, FastifyReply } from "fastify";
import { AccountService } from "../services/account.service.js";
import { z } from "zod";

const createAccountSchema = z.object({
  email: z.email(),
  name: z.string().min(1),
});

const updateAccountSchema = z.object({
  email: z.email().optional(),
  name: z.string().min(1).optional(),
});

export class AccountController {
  private accountService = new AccountService();

  async create(request: FastifyRequest, reply: FastifyReply) {
    try {
      const body = createAccountSchema.parse(request.body);
      const account = await this.accountService.createAccount(
        body.email,
        body.name
      );
      reply.status(201).send(account);
    } catch (error) {
      reply.status(400).send({ error: (error as Error).message });
    }
  }

  async getByEmail(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { email } = request.params as { email: string };
      const account = await this.accountService.getAccountByEmail(email);

      if (!account) {
        return reply.status(404).send({ error: "Account not found" });
      }

      reply.send(account);
    } catch (error) {
      reply.status(500).send({ error: (error as Error).message });
    }
  }

  async getById(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string };
      const account = await this.accountService.getAccountById(id);

      if (!account) {
        return reply.status(404).send({ error: "Account not found" });
      }

      reply.send(account);
    } catch (error) {
      reply.status(500).send({ error: (error as Error).message });
    }
  }

  async update(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string };
      const body = updateAccountSchema.parse(request.body);
      const account = await this.accountService.updateAccount(id, body);
      reply.send(account);
    } catch (error) {
      reply.status(400).send({ error: (error as Error).message });
    }
  }

  async delete(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string };
      await this.accountService.deleteAccount(id);
      reply.status(204).send();
    } catch (error) {
      reply.status(400).send({ error: (error as Error).message });
    }
  }
}
