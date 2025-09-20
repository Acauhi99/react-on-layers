import { describe, it, expect, mock } from "bun:test";
import { CreateTransactionUseCase } from "../../../../src/application/use-cases/create-transaction.use-case.js";
import { ITransactionRepository } from "../../../../src/domain/repositories/transaction.repository.interface.js";
import { IAccountRepository } from "../../../../src/domain/repositories/account.repository.interface.js";
import { Account } from "../../../../src/domain/entities/account.entity.js";

describe("CreateTransactionUseCase", () => {
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

  const mockAccountRepository: IAccountRepository = {
    save: mock(() => Promise.resolve()),
    findById: mock(() => Promise.resolve(null)),
    findByEmail: mock(() => Promise.resolve(null)),
    update: mock(() => Promise.resolve()),
    delete: mock(() => Promise.resolve()),
  };

  describe("execute", () => {
    it("should create transaction successfully", async () => {
      // Arrange
      const useCase = new CreateTransactionUseCase(
        mockTransactionRepository,
        mockAccountRepository
      );
      const account = Account.create(
        "account-id",
        "test@example.com",
        "Test User",
        "password"
      );
      const request = {
        accountId: "account-id",
        amount: 100.5,
        description: "Test transaction",
        categoryId: "category-id",
        date: new Date("2024-01-15"),
      };

      mockAccountRepository.findById = mock(() => Promise.resolve(account));
      mockTransactionRepository.save = mock(() => Promise.resolve());

      // Act
      const result = await useCase.execute(request);

      // Assert
      expect(result.accountId).toBe(request.accountId);
      expect(result.amount).toBe(request.amount);
      expect(result.description).toBe(request.description);
      expect(result.categoryId).toBe(request.categoryId);
      expect(result.date).toBe(request.date);
      expect(mockAccountRepository.findById).toHaveBeenCalledWith(
        request.accountId
      );
      expect(mockTransactionRepository.save).toHaveBeenCalled();
    });

    it("should throw error when account not found", async () => {
      // Arrange
      const useCase = new CreateTransactionUseCase(
        mockTransactionRepository,
        mockAccountRepository
      );
      const request = {
        accountId: "non-existent-id",
        amount: 100,
        description: "Test",
        categoryId: "cat-id",
        date: new Date(),
      };

      mockAccountRepository.findById = mock(() => Promise.resolve(null));

      // Act & Assert
      expect(useCase.execute(request)).rejects.toThrow("Account not found");
      expect(mockAccountRepository.findById).toHaveBeenCalledWith(
        request.accountId
      );
    });
  });
});
