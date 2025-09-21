import { ICategoryRepository } from "@/domain/repositories/category.repository.interface";
import { ITransactionRepository } from "@/domain/repositories/transaction.repository.interface";
import { describe, it, expect, mock } from "bun:test";
import { UpdateTransactionUseCase } from "./update-transaction.use-case";
import { Transaction } from "@/domain/entities/transaction.entity";
import { Category } from "@/domain/entities/category.entity";

describe("UpdateTransactionUseCase", () => {
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

  const mockCategoryRepository: ICategoryRepository = {
    save: mock(() => Promise.resolve()),
    findById: mock(() => Promise.resolve(null)),
    findByAccountId: mock(() => Promise.resolve([])),
    findByAccountAndType: mock(() => Promise.resolve([])),
    update: mock(() => Promise.resolve()),
    delete: mock(() => Promise.resolve()),
  };

  describe("execute", () => {
    it("should update transaction successfully", async () => {
      // Arrange
      const useCase = new UpdateTransactionUseCase(
        mockTransactionRepository,
        mockCategoryRepository
      );
      const transaction = Transaction.create(
        "txn-id",
        "account-id",
        100,
        "Old desc",
        "cat1",
        new Date()
      );
      const category = Category.create(
        "cat2",
        "account-id",
        "Food",
        "expense",
        "#FF0000"
      );

      const request = {
        id: "txn-id",
        amount: 200,
        description: "New description",
        categoryId: "cat2",
      };

      mockTransactionRepository.findById = mock(() =>
        Promise.resolve(transaction)
      );
      mockCategoryRepository.findById = mock(() => Promise.resolve(category));
      mockTransactionRepository.update = mock(() => Promise.resolve());

      // Act
      const result = await useCase.execute(request);

      // Assert
      expect(result.amount).toBe(200);
      expect(result.description).toBe("New description");
      expect(result.categoryId).toBe("cat2");
      expect(mockTransactionRepository.findById).toHaveBeenCalledWith("txn-id");
      expect(mockCategoryRepository.findById).toHaveBeenCalledWith("cat2");
      expect(mockTransactionRepository.update).toHaveBeenCalled();
    });

    it("should throw error when transaction not found", async () => {
      // Arrange
      const useCase = new UpdateTransactionUseCase(
        mockTransactionRepository,
        mockCategoryRepository
      );
      const request = { id: "non-existent-id" };

      mockTransactionRepository.findById = mock(() => Promise.resolve(null));

      // Act & Assert
      expect(useCase.execute(request)).rejects.toThrow("Transaction not found");
    });

    it("should throw error when category not found", async () => {
      // Arrange
      const useCase = new UpdateTransactionUseCase(
        mockTransactionRepository,
        mockCategoryRepository
      );
      const transaction = Transaction.create(
        "txn-id",
        "account-id",
        100,
        "Desc",
        "cat1",
        new Date()
      );

      const request = {
        id: "txn-id",
        categoryId: "non-existent-cat",
      };

      mockTransactionRepository.findById = mock(() =>
        Promise.resolve(transaction)
      );
      mockCategoryRepository.findById = mock(() => Promise.resolve(null));

      // Act & Assert
      expect(useCase.execute(request)).rejects.toThrow(
        "Category not found or does not belong to account"
      );
    });
  });
});
