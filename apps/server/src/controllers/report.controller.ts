import { FastifyRequest, FastifyReply } from "fastify";
import { FinancialReportService } from "../services/financial-report.service.js";

export class ReportController {
  private reportService = new FinancialReportService();

  async getMonthlyReport(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { accountId } = request.params as { accountId: string };
      const { year, month } = request.query as { year: string; month: string };

      const report = await this.reportService.generateMonthlyReport(
        accountId,
        parseInt(year),
        parseInt(month)
      );

      reply.send(report);
    } catch (error) {
      reply.status(400).send({ error: (error as Error).message });
    }
  }

  async getMonthlyReports(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { accountId } = request.params as { accountId: string };
      const { limit } = request.query as { limit?: string };

      const reports = await this.reportService.getMonthlyReports(
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

      const report = await this.reportService.generateYearlyReport(
        accountId,
        parseInt(year)
      );

      reply.send(report);
    } catch (error) {
      reply.status(400).send({ error: (error as Error).message });
    }
  }

  async updateMonthlyBalance(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { accountId } = request.params as { accountId: string };
      const { year, month } = request.body as { year: number; month: number };

      await this.reportService.updateMonthlyBalance(accountId, year, month);

      reply.status(204).send();
    } catch (error) {
      reply.status(400).send({ error: (error as Error).message });
    }
  }
}
