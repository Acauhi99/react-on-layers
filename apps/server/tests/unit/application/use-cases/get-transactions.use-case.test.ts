import { describe, it, expect, mock } from "bun:test";
import { GetTransactionsUseCase } from "../../../../src/application/use-cases/get-transactions.use-case.js";
import { ITransactionRepository } from "../../../../src/domain/repositories/transaction.repository.interface.js";
import { Transaction } from "../../../../src/domain/entities/transaction.entity.js";

describe("GetTransactionsUseCase", () => {
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

  describe("execute", () => {
    it("should return transactions with default limit", async () => {
      // Arrange
      const useCase = new GetTransactionsUseCase(mockTransactionRepository);
      const transactions = [
        Transaction.create(
          "txn1",
          "account-id",
          100,
          "Food",
          "cat1",
          new Date()
        ),
        Transaction.create(
          "txn2",
          "account-id",
          200,
          "Gas",
          "cat2",
          new Date()
        ),
      ];
      const request = { accountId: "account-id" };

      mockTransactionRepository.findByAccountId = mock(() =>
        Promise.resolve(transactions)
      );

      // Act
      const result = await useCase.execute(request);

      // Assert
      expect(result).toEqual(transactions);
      expect(mockTransactionRepository.findByAccountId).toHaveBeenCalledWith(
        "account-id",
        undefined
      );
    });

    it("should return transactions with custom limit", async () => {
      // Arrange
      const useCase = new GetTransactionsUseCase(mockTransactionRepository);
      const transactions = [
        Transaction.create(
          "txn1",
          "account-id",
          100,
          "Food",
          "cat1",
          new Date()
        ),
      ];
      const request = { accountId: "account-id", limit: 10 };

      mockTransactionRepository.findByAccountId = mock(() =>
        Promise.resolve(transactions)
      );

      // Act
      const result = await useCase.execute(request);

      // Assert
      expect(result).toEqual(transactions);
      expect(mockTransactionRepository.findByAccountId).toHaveBeenCalledWith(
        "account-id",
        10
      );
    });

    it("should return transactions by month when specified", async () => {
      // Arrange
      const useCase = new GetTransactionsUseCase(mockTransactionRepository);
      const transactions = [
        Transaction.create(
          "txn1",
          "account-id",
          100,
          "Food",
          "cat1",
          new Date("2024-01-15")
        ),
      ];
      const request = { accountId: "account-id", year: 2024, month: 1 };

      mockTransactionRepository.findByAccountAndMonth = mock(() =>
        Promise.resolve(transactions)
      );

      // Act
      const result = await useCase.execute(request);

      // Assert
      expect(result).toEqual(transactions);
      expect(
        mockTransactionRepository.findByAccountAndMonth
      ).toHaveBeenCalledWith("account-id", 2024, 1);
    });

    it("should return empty array when no transactions found", async () => {
      // Arrange
      const useCase = new GetTransactionsUseCase(mockTransactionRepository);
      const request = { accountId: "account-id" };

      mockTransactionRepository.findByAccountId = mock(() =>
        Promise.resolve([])
      );

      // Act
      const result = await useCase.execute(request);

      // Assert
      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });
  });
});
