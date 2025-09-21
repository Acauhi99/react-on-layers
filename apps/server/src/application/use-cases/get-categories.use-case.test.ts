import { ICategoryRepository } from "@/domain/repositories/category.repository.interface";
import { describe, it, expect, mock } from "bun:test";
import { GetCategoriesUseCase } from "./get-categories.use-case";
import { Category } from "@/domain/entities/category.entity";

describe("GetCategoriesUseCase", () => {
  const mockCategoryRepository: ICategoryRepository = {
    save: mock(() => Promise.resolve()),
    findById: mock(() => Promise.resolve(null)),
    findByAccountId: mock(() => Promise.resolve([])),
    findByAccountAndType: mock(() => Promise.resolve([])),
    update: mock(() => Promise.resolve()),
    delete: mock(() => Promise.resolve()),
  };

  describe("execute", () => {
    it("should return all categories when no type specified", async () => {
      // Arrange
      const useCase = new GetCategoriesUseCase(mockCategoryRepository);
      const categories = [
        Category.create("cat1", "account-id", "Salary", "income", "#00FF00"),
        Category.create("cat2", "account-id", "Food", "expense", "#FF0000"),
      ];
      const request = { accountId: "account-id" };

      mockCategoryRepository.findByAccountId = mock(() =>
        Promise.resolve(categories)
      );

      // Act
      const result = await useCase.execute(request);

      // Assert
      expect(result).toEqual(categories);
      expect(mockCategoryRepository.findByAccountId).toHaveBeenCalledWith(
        "account-id"
      );
    });

    it("should return filtered categories by type", async () => {
      // Arrange
      const useCase = new GetCategoriesUseCase(mockCategoryRepository);
      const incomeCategories = [
        Category.create("cat1", "account-id", "Salary", "income", "#00FF00"),
      ];
      const request = { accountId: "account-id", type: "income" as const };

      mockCategoryRepository.findByAccountAndType = mock(() =>
        Promise.resolve(incomeCategories)
      );

      // Act
      const result = await useCase.execute(request);

      // Assert
      expect(result).toEqual(incomeCategories);
      expect(mockCategoryRepository.findByAccountAndType).toHaveBeenCalledWith(
        "account-id",
        "income"
      );
    });

    it("should return expense categories when type is expense", async () => {
      // Arrange
      const useCase = new GetCategoriesUseCase(mockCategoryRepository);
      const expenseCategories = [
        Category.create("cat2", "account-id", "Food", "expense", "#FF0000"),
      ];
      const request = { accountId: "account-id", type: "expense" as const };

      mockCategoryRepository.findByAccountAndType = mock(() =>
        Promise.resolve(expenseCategories)
      );

      // Act
      const result = await useCase.execute(request);

      // Assert
      expect(result).toEqual(expenseCategories);
      expect(mockCategoryRepository.findByAccountAndType).toHaveBeenCalledWith(
        "account-id",
        "expense"
      );
    });
  });
});
