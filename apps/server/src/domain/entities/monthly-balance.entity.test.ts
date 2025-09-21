import { describe, it, expect } from "bun:test";
import { MonthlyBalance } from "./monthly-balance.entity";

describe("MonthlyBalance Entity", () => {
  describe("create", () => {
    it("should create monthly balance with calculated values", () => {
      // Arrange
      const id = "balance-id";
      const accountId = "account-id";
      const year = 2024;
      const month = 1;
      const totalIncome = 5000;
      const totalExpenses = 3000;
      const totalInvestments = 1500;

      // Act
      const balance = MonthlyBalance.create(
        id,
        accountId,
        year,
        month,
        totalIncome,
        totalExpenses,
        totalInvestments
      );

      // Assert
      expect(balance.id).toBe(id);
      expect(balance.accountId).toBe(accountId);
      expect(balance.year).toBe(year);
      expect(balance.month).toBe(month);
      expect(balance.totalIncome).toBe(totalIncome);
      expect(balance.totalExpenses).toBe(totalExpenses);
      expect(balance.totalInvestments).toBe(totalInvestments);
      expect(balance.netBalance).toBe(2000); // 5000 - 3000
      expect(balance.availableToInvest).toBe(500); // 2000 - 1500
      expect(balance.createdAt).toBeInstanceOf(Date);
      expect(balance.modifiedAt).toBeInstanceOf(Date);
    });

    it("should handle negative available to invest", () => {
      // Arrange
      const totalIncome = 1000;
      const totalExpenses = 800;
      const totalInvestments = 500;

      // Act
      const balance = MonthlyBalance.create(
        "id",
        "account",
        2024,
        1,
        totalIncome,
        totalExpenses,
        totalInvestments
      );

      // Assert
      expect(balance.netBalance).toBe(200); // 1000 - 800
      expect(balance.availableToInvest).toBe(-300); // 200 - 500
    });

    it("should handle zero values", () => {
      // Arrange
      const totalIncome = 0;
      const totalExpenses = 0;
      const totalInvestments = 0;

      // Act
      const balance = MonthlyBalance.create(
        "id",
        "account",
        2024,
        1,
        totalIncome,
        totalExpenses,
        totalInvestments
      );

      // Assert
      expect(balance.netBalance).toBe(0);
      expect(balance.availableToInvest).toBe(0);
    });
  });
});
