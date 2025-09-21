import { IAccountRepository } from "@/domain/repositories/account.repository.interface";
import { ICategoryRepository } from "@/domain/repositories/category.repository.interface";
import { describe, it, expect, mock } from "bun:test";
import { CreateCategoryUseCase } from "./create-category.use-case";
import { Account } from "@/domain/entities/account.entity";

describe("CreateCategoryUseCase", () => {
  const mockCategoryRepository: ICategoryRepository = {
    save: mock(() => Promise.resolve()),
    findById: mock(() => Promise.resolve(null)),
    findByAccountId: mock(() => Promise.resolve([])),
    findByAccountAndType: mock(() => Promise.resolve([])),
    update: mock(() => Promise.resolve()),
    delete: mock(() => Promise.resolve()),
  };

  const mockAccountRepository: IAccountRepository = {
    save: mock(() => Promise.resolve()),
    findById: mock(() => Promise.resolve(null)),
    findByEmail: mock(() => Promise.resolve(null)),
    update: mock(() => Promise.resolve()),
    delete: mock(() => Promise.resolve()),
  };

  describe("execute", () => {
    it("should create category successfully", async () => {
      // Arrange
      const useCase = new CreateCategoryUseCase(
        mockCategoryRepository,
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
        name: "Food",
        type: "expense" as const,
        color: "#FF0000",
      };

      mockAccountRepository.findById = mock(() => Promise.resolve(account));
      mockCategoryRepository.save = mock(() => Promise.resolve());

      // Act
      const result = await useCase.execute(request);

      // Assert
      expect(result.accountId).toBe(request.accountId);
      expect(result.name).toBe(request.name);
      expect(result.type).toBe(request.type);
      expect(result.color).toBe(request.color);
      expect(mockAccountRepository.findById).toHaveBeenCalledWith(
        request.accountId
      );
      expect(mockCategoryRepository.save).toHaveBeenCalled();
    });

    it("should throw error when account not found", async () => {
      // Arrange
      const useCase = new CreateCategoryUseCase(
        mockCategoryRepository,
        mockAccountRepository
      );
      const request = {
        accountId: "non-existent-id",
        name: "Food",
        type: "expense" as const,
        color: "#FF0000",
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
