import { describe, it, expect, mock } from "bun:test";
import { DeleteTransactionUseCase } from "../../../../src/application/use-cases/delete-transaction.use-case.js";
import { ITransactionRepository } from "../../../../src/domain/repositories/transaction.repository.interface.js";
import { Transaction } from "../../../../src/domain/entities/transaction.entity.js";

describe("DeleteTransactionUseCase", () => {
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
    it("should delete transaction successfully", async () => {
      // Arrange
      const useCase = new DeleteTransactionUseCase(mockTransactionRepository);
      const transaction = Transaction.create(
        "txn-id",
        "account-id",
        100,
        "Food",
        "cat1",
        new Date()
      );
      const request = { id: "txn-id" };

      mockTransactionRepository.findById = mock(() =>
        Promise.resolve(transaction)
      );
      mockTransactionRepository.delete = mock(() => Promise.resolve());

      // Act
      await useCase.execute(request);

      // Assert
      expect(mockTransactionRepository.findById).toHaveBeenCalledWith("txn-id");
      expect(mockTransactionRepository.delete).toHaveBeenCalledWith("txn-id");
    });

    it("should throw error when transaction not found", async () => {
      // Arrange
      const useCase = new DeleteTransactionUseCase(mockTransactionRepository);
      const request = { id: "non-existent-id" };

      mockTransactionRepository.findById = mock(() => Promise.resolve(null));

      // Act & Assert
      expect(useCase.execute(request)).rejects.toThrow("Transaction not found");
      expect(mockTransactionRepository.findById).toHaveBeenCalledWith(
        "non-existent-id"
      );
    });
  });
});
