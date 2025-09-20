import { FastifyRequest, FastifyReply } from "fastify";
import { GenerateMonthlyReportUseCase } from "../../application/use-cases/generate-monthly-report.use-case.js";
import { CachedMonthlyBalanceRepository } from "../../infrastructure/repositories/cached-monthly-balance.repository.js";
import { CachedTransactionRepository } from "../../infrastructure/repositories/cached-transaction.repository.js";
import { CachedInvestmentRepository } from "../../infrastructure/repositories/cached-investment.repository.js";

export class ReportController {
  private monthlyBalanceRepository = new CachedMonthlyBalanceRepository();
  private transactionRepository = new CachedTransactionRepository();
  private investmentRepository = new CachedInvestmentRepository();

  async getMonthlyReport(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { accountId } = request.params as { accountId: string };
      const { year, month } = request.query as { year: string; month: string };

      const useCase = new GenerateMonthlyReportUseCase(
        this.monthlyBalanceRepository,
        this.transactionRepository,
        this.investmentRepository
      );

      const report = await useCase.execute({
        accountId,
        year: parseInt(year),
        month: parseInt(month),
      });

      reply.send(report);
    } catch (error) {
      reply.status(400).send({ error: (error as Error).message });
    }
  }

  async getMonthlyReports(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { accountId } = request.params as { accountId: string };
      const { limit } = request.query as { limit?: string };

      const reports = await this.monthlyBalanceRepository.findByAccountId(
        accountId,
        limit ? parseInt(limit) : undefined
      );

      reply.send(reports);
    } catch (error) {
      reply.status(500).send({ error: (error as Error).message });
    }
  }

  async getYearlyReport(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { accountId } = request.params as { accountId: string };
      const { year } = request.query as { year: string };

      const monthlyData =
        await this.monthlyBalanceRepository.findByAccountAndYear(
          accountId,
          parseInt(year)
        );

      const yearlyTotals = await this.monthlyBalanceRepository.getYearlyTotals(
        accountId,
        parseInt(year)
      );

      reply.send({
        year: parseInt(year),
        ...yearlyTotals,
        monthlyData,
      });
    } catch (error) {
      reply.status(400).send({ error: (error as Error).message });
    }
  }
}
