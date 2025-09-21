import { describe, it, expect, mock, beforeEach } from "bun:test";
import { CachedCategoryRepository } from "./cached-category.repository";
import { cache } from "../cache/memory-cache";
import { Category } from "@/domain/entities/category.entity";

describe("CachedCategoryRepository", () => {
  let repository: CachedCategoryRepository;

  beforeEach(() => {
    repository = new CachedCategoryRepository();
    cache.clear();
  });

  describe("findByAccountId", () => {
    it("should cache categories after first call", async () => {
      // Arrange
      const accountId = "account-id";
      const categories = [
        Category.create("cat1", accountId, "Food", "expense", "#FF0000"),
        Category.create("cat2", accountId, "Salary", "income", "#00FF00"),
      ];

      // Mock the underlying repository method
      const originalMethod = repository["repository"].findByAccountId;
      repository["repository"].findByAccountId = mock(() =>
        Promise.resolve(categories)
      );

      // Act - First call
      const result1 = await repository.findByAccountId(accountId);

      // Act - Second call (should use cache)
      const result2 = await repository.findByAccountId(accountId);

      // Assert
      expect(result1).toEqual(categories);
      expect(result2).toEqual(categories);
      expect(repository["repository"].findByAccountId).toHaveBeenCalledTimes(1);
    });

    it("should invalidate cache when saving new category", async () => {
      // Arrange
      const accountId = "account-id";
      const category = Category.create(
        "cat1",
        accountId,
        "Food",
        "expense",
        "#FF0000"
      );

      // Set cache first
      cache.set(`categories:${accountId}`, [category]);

      // Mock the underlying save method
      repository["repository"].save = mock(() => Promise.resolve());

      // Act
      await repository.save(category);

      // Assert
      const cachedData = cache.get(`categories:${accountId}`);
      expect(cachedData).toBeNull();
    });
  });

  describe("findById", () => {
    it("should cache individual category", async () => {
      // Arrange
      const category = Category.create(
        "cat1",
        "account-id",
        "Food",
        "expense",
        "#FF0000"
      );

      repository["repository"].findById = mock(() => Promise.resolve(category));

      // Act
      const result1 = await repository.findById("cat1");
      const result2 = await repository.findById("cat1");

      // Assert
      expect(result1).toEqual(category);
      expect(result2).toEqual(category);
      expect(repository["repository"].findById).toHaveBeenCalledTimes(1);
    });

    it("should return null for non-existent category", async () => {
      // Arrange
      repository["repository"].findById = mock(() => Promise.resolve(null));

      // Act
      const result = await repository.findById("non-existent");

      // Assert
      expect(result).toBeNull();
    });
  });

  describe("update", () => {
    it("should invalidate cache after update", async () => {
      // Arrange
      const category = Category.create(
        "cat1",
        "account-id",
        "Food",
        "expense",
        "#FF0000"
      );

      cache.set(`category:${category.id}`, category);
      cache.set(`categories:${category.accountId}`, [category]);

      repository["repository"].update = mock(() => Promise.resolve());

      // Act
      await repository.update(category);

      // Assert
      expect(cache.get(`category:${category.id}`)).toBeNull();
      expect(cache.get(`categories:${category.accountId}`)).toBeNull();
    });
  });
});
