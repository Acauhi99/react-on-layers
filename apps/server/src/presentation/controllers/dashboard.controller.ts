import { FastifyRequest, FastifyReply } from "fastify";
import { GetDashboardUseCase } from "../../application/use-cases/get-dashboard.use-case.js";
import { TransactionRepositoryImpl } from "../../infrastructure/repositories/transaction.repository.impl.js";
import { InvestmentRepositoryImpl } from "../../infrastructure/repositories/investment.repository.impl.js";
import { CategoryRepositoryImpl } from "../../infrastructure/repositories/category.repository.impl.js";

export class DashboardController {
  private transactionRepository = new TransactionRepositoryImpl();
  private investmentRepository = new InvestmentRepositoryImpl();
  private categoryRepository = new CategoryRepositoryImpl();

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
