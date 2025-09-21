import { IAccountRepository } from "@/domain/repositories/account.repository.interface";
import { IInvestmentRepository } from "@/domain/repositories/investment.repository.interface";
import { describe, it, expect, mock } from "bun:test";
import { CreateInvestmentUseCase } from "./create-investment.use-case";
import { Account } from "@/domain/entities/account.entity";

describe("CreateInvestmentUseCase", () => {
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

  const mockAccountRepository: IAccountRepository = {
    save: mock(() => Promise.resolve()),
    findById: mock(() => Promise.resolve(null)),
    findByEmail: mock(() => Promise.resolve(null)),
    update: mock(() => Promise.resolve()),
    delete: mock(() => Promise.resolve()),
  };

  describe("execute", () => {
    it("should create investment successfully", async () => {
      // Arrange
      const useCase = new CreateInvestmentUseCase(
        mockInvestmentRepository,
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
        name: "AAPL Stock",
        investmentTypeId: "stocks",
        amount: 1000,
        date: new Date("2024-01-15"),
      };

      mockAccountRepository.findById = mock(() => Promise.resolve(account));
      mockInvestmentRepository.save = mock(() => Promise.resolve());

      // Act
      const result = await useCase.execute(request);

      // Assert
      expect(result.accountId).toBe(request.accountId);
      expect(result.name).toBe(request.name);
      expect(result.investmentTypeId).toBe(request.investmentTypeId);
      expect(result.amount).toBe(request.amount);
      expect(result.date).toBe(request.date);
      expect(mockAccountRepository.findById).toHaveBeenCalledWith(
        request.accountId
      );
      expect(mockInvestmentRepository.save).toHaveBeenCalled();
    });

    it("should throw error when account not found", async () => {
      // Arrange
      const useCase = new CreateInvestmentUseCase(
        mockInvestmentRepository,
        mockAccountRepository
      );
      const request = {
        accountId: "non-existent-id",
        name: "AAPL Stock",
        investmentTypeId: "stocks",
        amount: 1000,
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
