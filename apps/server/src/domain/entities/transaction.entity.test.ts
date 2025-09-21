import { describe, it, expect } from "bun:test";
import { Transaction } from "./transaction.entity";

describe("Transaction Entity", () => {
  describe("create", () => {
    it("should create transaction with valid data", () => {
      // Arrange
      const id = "txn-id";
      const accountId = "account-id";
      const amount = 100.5;
      const description = "Test transaction";
      const categoryId = "category-id";
      const date = new Date("2024-01-15");

      // Act
      const transaction = Transaction.create(
        id,
        accountId,
        amount,
        description,
        categoryId,
        date
      );

      // Assert
      expect(transaction.id).toBe(id);
      expect(transaction.accountId).toBe(accountId);
      expect(transaction.amount).toBe(amount);
      expect(transaction.description).toBe(description);
      expect(transaction.categoryId).toBe(categoryId);
      expect(transaction.date).toBe(date);
      expect(transaction.createdAt).toBeInstanceOf(Date);
      expect(transaction.modifiedAt).toBeInstanceOf(Date);
    });
  });

  describe("update", () => {
    it("should update transaction fields", () => {
      // Arrange
      const transaction = Transaction.create(
        "id",
        "account",
        100,
        "Old desc",
        "cat1",
        new Date()
      );
      const newAmount = 200;
      const newDescription = "New description";
      const newCategoryId = "cat2";
      const newDate = new Date("2024-02-01");

      // Act
      const updated = transaction.update(
        newAmount,
        newDescription,
        newCategoryId,
        newDate
      );

      // Assert
      expect(updated.amount).toBe(newAmount);
      expect(updated.description).toBe(newDescription);
      expect(updated.categoryId).toBe(newCategoryId);
      expect(updated.date).toBe(newDate);
      expect(updated.id).toBe(transaction.id);
      expect(updated.accountId).toBe(transaction.accountId);
      expect(updated.modifiedAt).not.toBe(transaction.modifiedAt);
    });

    it("should keep original values when no updates provided", () => {
      // Arrange
      const transaction = Transaction.create(
        "id",
        "account",
        100,
        "Description",
        "cat",
        new Date()
      );

      // Act
      const updated = transaction.update();

      // Assert
      expect(updated.amount).toBe(transaction.amount);
      expect(updated.description).toBe(transaction.description);
      expect(updated.categoryId).toBe(transaction.categoryId);
      expect(updated.date).toBe(transaction.date);
      expect(updated.modifiedAt).not.toBe(transaction.modifiedAt);
    });
  });
});
