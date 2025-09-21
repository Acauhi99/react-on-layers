import { describe, it, expect } from "bun:test";
import { Investment } from "./investment.entity";

describe("Investment Entity", () => {
  describe("create", () => {
    it("should create investment with valid data", () => {
      // Arrange
      const id = "inv-id";
      const accountId = "account-id";
      const name = "AAPL Stock";
      const investmentTypeId = "stocks";
      const amount = 1000.5;
      const date = new Date("2024-01-15");

      // Act
      const investment = Investment.create(
        id,
        accountId,
        name,
        investmentTypeId,
        amount,
        date
      );

      // Assert
      expect(investment.id).toBe(id);
      expect(investment.accountId).toBe(accountId);
      expect(investment.name).toBe(name);
      expect(investment.investmentTypeId).toBe(investmentTypeId);
      expect(investment.amount).toBe(amount);
      expect(investment.date).toBe(date);
      expect(investment.createdAt).toBeInstanceOf(Date);
      expect(investment.modifiedAt).toBeInstanceOf(Date);
    });
  });

  describe("update", () => {
    it("should update investment fields", () => {
      // Arrange
      const investment = Investment.create(
        "id",
        "account",
        "Old Name",
        "stocks",
        100,
        new Date()
      );
      const newName = "New Investment";
      const newAmount = 500;
      const newDate = new Date("2024-02-01");

      // Act
      const updated = investment.update(newName, undefined, newAmount, newDate);

      // Assert
      expect(updated.name).toBe(newName);
      expect(updated.amount).toBe(newAmount);
      expect(updated.date).toBe(newDate);
      expect(updated.id).toBe(investment.id);
      expect(updated.accountId).toBe(investment.accountId);
      expect(updated.investmentTypeId).toBe(investment.investmentTypeId);
      expect(updated.modifiedAt).not.toBe(investment.modifiedAt);
    });

    it("should keep original values when no updates provided", () => {
      // Arrange
      const investment = Investment.create(
        "id",
        "account",
        "Investment",
        "bonds",
        200,
        new Date()
      );

      // Act
      const updated = investment.update();

      // Assert
      expect(updated.name).toBe(investment.name);
      expect(updated.amount).toBe(investment.amount);
      expect(updated.date).toBe(investment.date);
      expect(updated.modifiedAt).not.toBe(investment.modifiedAt);
    });
  });
});
