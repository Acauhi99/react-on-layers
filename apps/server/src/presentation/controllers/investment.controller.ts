import { CreateInvestmentUseCase } from "@/application/use-cases/create-investment.use-case";
import { AccountRepositoryImpl } from "@/infrastructure/repositories/account.repository.impl";
import { CachedInvestmentRepository } from "@/infrastructure/repositories/cached-investment.repository";
import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";

const createInvestmentSchema = z.object({
  name: z.string().min(1),
  investment_type_id: z.string(),
  amount: z.number().positive(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export class InvestmentController {
  private investmentRepository = new CachedInvestmentRepository();
  private accountRepository = new AccountRepositoryImpl();

  async create(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { accountId } = request.params as { accountId: string };
      const body = createInvestmentSchema.parse(request.body);

      const useCase = new CreateInvestmentUseCase(
        this.investmentRepository,
        this.accountRepository
      );
      const investment = await useCase.execute({
        accountId,
        name: body.name,
        investmentTypeId: body.investment_type_id,
        amount: body.amount,
        date: new Date(body.date),
      });

      reply.status(201).send(investment);
    } catch (error) {
      reply.status(400).send({ error: (error as Error).message });
    }
  }

  async getByAccount(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { accountId } = request.params as { accountId: string };
      const investments = await this.investmentRepository.findByAccountId(
        accountId
      );
      reply.send(investments);
    } catch (error) {
      reply.status(500).send({ error: (error as Error).message });
    }
  }

  async getSummary(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { accountId } = request.params as { accountId: string };
      const total = await this.investmentRepository.getAccountTotal(accountId);
      const allocation = await this.investmentRepository.getAccountAllocation(
        accountId
      );

      const allocationWithPercentage = allocation.map((item) => ({
        ...item,
        percentage: total > 0 ? (item.total_amount / total) * 100 : 0,
      }));

      reply.send({ total, allocation: allocationWithPercentage });
    } catch (error) {
      reply.status(500).send({ error: (error as Error).message });
    }
  }
}
