import { FastifyRequest, FastifyReply } from "fastify";
import { InvestmentService } from "../services/investment.service.js";
import { z } from "zod";

const createInvestmentSchema = z.object({
  name: z.string().min(1),
  investment_type_id: z.string(),
  amount: z.number().positive(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

const updateInvestmentSchema = z.object({
  name: z.string().min(1).optional(),
  investment_type_id: z.string().optional(),
  amount: z.number().positive().optional(),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
});

export class InvestmentController {
  private investmentService = new InvestmentService();

  async getTypes(request: FastifyRequest, reply: FastifyReply) {
    try {
      const types = await this.investmentService.getInvestmentTypes();
      reply.send(types);
    } catch (error) {
      reply.status(500).send({ error: (error as Error).message });
    }
  }

  async create(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { accountId } = request.params as { accountId: string };
      const body = createInvestmentSchema.parse(request.body);
      const investment = await this.investmentService.createInvestment(
        accountId,
        body.name,
        body.investment_type_id,
        body.amount,
        body.date
      );
      reply.status(201).send(investment);
    } catch (error) {
      reply.status(400).send({ error: (error as Error).message });
    }
  }

  async getByAccount(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { accountId } = request.params as { accountId: string };
      const { type_id } = request.query as { type_id?: string };

      const investments = type_id
        ? await this.investmentService.getInvestmentsByType(accountId, type_id)
        : await this.investmentService.getInvestmentsByAccount(accountId);

      reply.send(investments);
    } catch (error) {
      reply.status(500).send({ error: (error as Error).message });
    }
  }

  async getById(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string };
      const investment = await this.investmentService.getInvestmentById(id);

      if (!investment) {
        return reply.status(404).send({ error: "Investment not found" });
      }

      reply.send(investment);
    } catch (error) {
      reply.status(500).send({ error: (error as Error).message });
    }
  }

  async update(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string };
      const body = updateInvestmentSchema.parse(request.body);
      const investment = await this.investmentService.updateInvestment(
        id,
        body
      );
      reply.send(investment);
    } catch (error) {
      reply.status(400).send({ error: (error as Error).message });
    }
  }

  async delete(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string };
      await this.investmentService.deleteInvestment(id);
      reply.status(204).send();
    } catch (error) {
      reply.status(400).send({ error: (error as Error).message });
    }
  }

  async getSummary(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { accountId } = request.params as { accountId: string };
      const summary = await this.investmentService.getAccountInvestmentSummary(
        accountId
      );
      reply.send(summary);
    } catch (error) {
      reply.status(500).send({ error: (error as Error).message });
    }
  }
}
