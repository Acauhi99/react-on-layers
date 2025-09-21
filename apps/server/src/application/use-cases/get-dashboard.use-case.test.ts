import { ICategoryRepository } from "@/domain/repositories/category.repository.interface";
import { IInvestmentRepository } from "@/domain/repositories/investment.repository.interface";
import { ITransactionRepository } from "@/domain/repositories/transaction.repository.interface";
import { describe, it, expect, mock } from "bun:test";
import { GetDashboardUseCase } from "./get-dashboard.use-case";
import { Transaction } from "@/domain/entities/transaction.entity";
import { Category } from "@/domain/entities/category.entity";

describe("GetDashboardUseCase", () => {
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

  const mockCategoryRepository: ICategoryRepository = {
    save: mock(() => Promise.resolve()),
    findById: mock(() => Promise.resolve(null)),
    findByAccountId: mock(() => Promise.resolve([])),
    findByAccountAndType: mock(() => Promise.resolve([])),
    update: mock(() => Promise.resolve()),
    delete: mock(() => Promise.resolve()),
  };

  describe("execute", () => {
    it("should return dashboard data successfully", async () => {
      // Arrange
      const useCase = new GetDashboardUseCase(
        mockTransactionRepository,
        mockInvestmentRepository,
        mockCategoryRepository
      );

      const request = { accountId: "account-id" };
      const monthlyTotals = { income: 5000, expenses: 3000 };
      const totalInvestments = 10000;
      const allocation = [
        { type_name: "Stocks", total_amount: 6000, count: 3 },
        { type_name: "Bonds", total_amount: 4000, count: 2 },
      ];
      const recentTransactions = [
        Transaction.create(
          "txn1",
          "account-id",
          100,
          "Test",
          "cat1",
          new Date()
        ),
      ];
      const incomeCategories = [
        Category.create("cat1", "account-id", "Salary", "income", "#00FF00"),
      ];
      const expenseCategories = [
        Category.create("cat2", "account-id", "Food", "expense", "#FF0000"),
      ];

      mockTransactionRepository.getMonthlyTotals = mock(() =>
        Promise.resolve(monthlyTotals)
      );
      mockInvestmentRepository.getAccountTotal = mock(() =>
        Promise.resolve(totalInvestments)
      );
      mockInvestmentRepository.getAccountAllocation = mock(() =>
        Promise.resolve(allocation)
      );
      mockTransactionRepository.findByAccountId = mock(() =>
        Promise.resolve(recentTransactions)
      );
      mockCategoryRepository.findByAccountAndType = mock((accountId, type) => {
        if (type === "income") return Promise.resolve(incomeCategories);
        return Promise.resolve(expenseCategories);
      });

      // Act
      const result = await useCase.execute(request);

      // Assert
      expect(result.currentMonth.income).toBe(5000);
      expect(result.currentMonth.expenses).toBe(3000);
      expect(result.currentMonth.balance).toBe(2000);
      expect(result.currentMonth.investments).toBe(10000);
      expect(result.totalInvestments).toBe(10000);
      expect(result.investmentAllocation).toHaveLength(2);
      expect(result.investmentAllocation[0].percentage).toBe(60); // 6000/10000 * 100
      expect(result.recentTransactions).toHaveLength(1);
      expect(result.categoriesCount.income).toBe(1);
      expect(result.categoriesCount.expense).toBe(1);
    });

    it("should handle zero investments", async () => {
      // Arrange
      const useCase = new GetDashboardUseCase(
        mockTransactionRepository,
        mockInvestmentRepository,
        mockCategoryRepository
      );

      mockTransactionRepository.getMonthlyTotals = mock(() =>
        Promise.resolve({ income: 1000, expenses: 500 })
      );
      mockInvestmentRepository.getAccountTotal = mock(() => Promise.resolve(0));
      mockInvestmentRepository.getAccountAllocation = mock(() =>
        Promise.resolve([])
      );
      mockTransactionRepository.findByAccountId = mock(() =>
        Promise.resolve([])
      );
      mockCategoryRepository.findByAccountAndType = mock(() =>
        Promise.resolve([])
      );

      // Act
      const result = await useCase.execute({ accountId: "account-id" });

      // Assert
      expect(result.totalInvestments).toBe(0);
      expect(result.investmentAllocation).toHaveLength(0);
    });
  });
});
