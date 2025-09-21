import { IInvestmentRepository } from "@/domain/repositories/investment.repository.interface";
import { IMonthlyBalanceRepository } from "@/domain/repositories/monthly-balance.repository.interface";
import { ITransactionRepository } from "@/domain/repositories/transaction.repository.interface";
import { describe, it, expect, mock } from "bun:test";
import { GenerateMonthlyReportUseCase } from "./generate-monthly-report.use-case";

describe("GenerateMonthlyReportUseCase", () => {
  const mockTransactionRepository: ITransactionRepository = {
    save: mock(() => Promise.resolve()),
    findById: mock(() => Promise.resolve(null)),
    findByAccountId: mock(() => Promise.resolve([])),
    findByAccountAndMonth: mock(() => Promise.resolve([])),
    findByAccountAndDateRange: mock(() => Promise.resolve([])),
    update: mock(() => Promise.resolve()),
    delete: mock(() => Promise.resolve()),
    getMonthlyTotals: mock(() => Promise.resolve({ income: 0, expenses: 0 })),
  };

  const mockInvestmentRepository: IInvestmentRepository = {
    save: mock(() => Promise.resolve()),
    findById: mock(() => Promise.resolve(null)),
    findByAccountId: mock(() => Promise.resolve([])),
    findByAccountAndType: mock(() => Promise.resolve([])),
    update: mock(() => Promise.resolve()),
    delete: mock(() => Promise.resolve()),
    getAccountTotal: mock(() => Promise.resolve(0)),
    getAccountAllocation: mock(() => Promise.resolve([])),
  };

  const mockMonthlyBalanceRepository: IMonthlyBalanceRepository = {
    save: mock(() => Promise.resolve()),
    findByAccountAndMonth: mock(() => Promise.resolve(null)),
    findByAccountId: mock(() => Promise.resolve([])),
    findByAccountAndYear: mock(() => Promise.resolve([])),
    getYearlyTotals: mock(() =>
      Promise.resolve({
        totalIncome: 0,
        totalExpenses: 0,
        netBalance: 0,
        totalInvestments: 0,
      })
    ),
  };

  describe("execute", () => {
    it("should generate monthly report successfully", async () => {
      // Arrange
      const useCase = new GenerateMonthlyReportUseCase(
        mockMonthlyBalanceRepository,
        mockTransactionRepository,
        mockInvestmentRepository
      );

      const request = {
        accountId: "account-id",
        year: 2024,
        month: 1,
      };

      const monthlyTotals = { income: 5000, expenses: 3000 };
      const investments = 1500;

      mockTransactionRepository.getMonthlyTotals = mock(() =>
        Promise.resolve(monthlyTotals)
      );
      mockInvestmentRepository.getAccountTotal = mock(() =>
        Promise.resolve(investments)
      );
      mockMonthlyBalanceRepository.findByAccountAndMonth = mock(() =>
        Promise.resolve(null)
      );
      mockMonthlyBalanceRepository.save = mock(() => Promise.resolve());

      // Act
      const result = await useCase.execute(request);

      // Assert
      expect(result).toBeDefined();
      expect(result.accountId).toBe(request.accountId);
      expect(result.year).toBe(request.year);
      expect(result.month).toBe(request.month);
      expect(result.totalIncome).toBe(5000);
      expect(result.totalExpenses).toBe(3000);
      expect(result.totalInvestments).toBe(1500);
      expect(result.netBalance).toBe(2000); // 5000 - 3000
      expect(result.availableToInvest).toBe(500); // 2000 - 1500
      expect(mockMonthlyBalanceRepository.save).toHaveBeenCalled();
    });

    it("should return existing report if already generated", async () => {
      // Arrange
      const useCase = new GenerateMonthlyReportUseCase(
        mockMonthlyBalanceRepository,
        mockTransactionRepository,
        mockInvestmentRepository
      );

      const request = {
        accountId: "account-id",
        year: 2024,
        month: 1,
      };

      const existingReport = {
        id: "report-id",
        accountId: "account-id",
        year: 2024,
        month: 1,
        totalIncome: 4000,
        totalExpenses: 2500,
        totalInvestments: 1000,
        netBalance: 1500,
        availableToInvest: 500,
        createdAt: new Date(),
        modifiedAt: new Date(),
      };

      mockMonthlyBalanceRepository.findByAccountAndMonth = mock(() =>
        Promise.resolve(existingReport)
      );

      // Act
      const result = await useCase.execute(request);

      // Assert
      expect(result).toEqual(existingReport);
      expect(
        mockMonthlyBalanceRepository.findByAccountAndMonth
      ).toHaveBeenCalledWith("account-id", 2024, 1);
    });
  });
});
