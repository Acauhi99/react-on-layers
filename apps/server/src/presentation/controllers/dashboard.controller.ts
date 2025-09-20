import { FastifyRequest, FastifyReply } from "fastify";
import { GetDashboardUseCase } from "../../application/use-cases/get-dashboard.use-case.js";
import { CachedTransactionRepository } from "../../infrastructure/repositories/cached-transaction.repository.js";
import { CachedInvestmentRepository } from "../../infrastructure/repositories/cached-investment.repository.js";
import { CachedCategoryRepository } from "../../infrastructure/repositories/cached-category.repository.js";

export class DashboardController {
  private transactionRepository = new CachedTransactionRepository();
  private investmentRepository = new CachedInvestmentRepository();
  private categoryRepository = new CachedCategoryRepository();

  async getDashboard(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { accountId } = request.params as { accountId: string };
      const { year, month } = request.query as {
        year?: string;
        month?: string;
      };

      const useCase = new GetDashboardUseCase(
        this.transactionRepository,
        this.investmentRepository,
        this.categoryRepository
      );

      const dashboard = await useCase.execute({
        accountId,
        year: year ? parseInt(year) : undefined,
        month: month ? parseInt(month) : undefined,
      });

      reply.send(dashboard);
    } catch (error) {
      reply.status(500).send({ error: (error as Error).message });
    }
  }
}
