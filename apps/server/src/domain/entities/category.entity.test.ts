import { describe, it, expect } from "bun:test";
import { Category, CategoryType } from "./category.entity";

describe("Category Entity", () => {
  describe("create", () => {
    it("should create income category with valid data", () => {
      // Arrange
      const id = "cat-id";
      const accountId = "account-id";
      const name = "Salary";
      const type: CategoryType = "income";
      const color = "#00FF00";

      // Act
      const category = Category.create(id, accountId, name, type, color);

      // Assert
      expect(category.id).toBe(id);
      expect(category.accountId).toBe(accountId);
      expect(category.name).toBe(name);
      expect(category.type).toBe(type);
      expect(category.color).toBe(color);
      expect(category.createdAt).toBeInstanceOf(Date);
      expect(category.modifiedAt).toBeInstanceOf(Date);
    });

    it("should create expense category with valid data", () => {
      // Arrange
      const id = "cat-id";
      const accountId = "account-id";
      const name = "Food";
      const type: CategoryType = "expense";
      const color = "#FF0000";

      // Act
      const category = Category.create(id, accountId, name, type, color);

      // Assert
      expect(category.type).toBe("expense");
      expect(category.name).toBe(name);
    });
  });

  describe("update", () => {
    it("should update category fields", () => {
      // Arrange
      const category = Category.create(
        "id",
        "account",
        "Old Name",
        "income",
        "#000000"
      );
      const newName = "New Name";
      const newColor = "#FFFFFF";

      // Act
      const updated = category.update(newName, undefined, newColor);

      // Assert
      expect(updated.name).toBe(newName);
      expect(updated.color).toBe(newColor);
      expect(updated.id).toBe(category.id);
      expect(updated.accountId).toBe(category.accountId);
      expect(updated.type).toBe(category.type);
      expect(updated.modifiedAt).not.toBe(category.modifiedAt);
    });

    it("should keep original values when no updates provided", () => {
      // Arrange
      const category = Category.create(
        "id",
        "account",
        "Name",
        "expense",
        "#123456"
      );

      // Act
      const updated = category.update();

      // Assert
      expect(updated.name).toBe(category.name);
      expect(updated.color).toBe(category.color);
      expect(updated.modifiedAt).not.toBe(category.modifiedAt);
    });
  });
});
