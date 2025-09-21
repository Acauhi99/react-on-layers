import { describe, it, expect, mock, beforeEach } from "bun:test";
import { CachedMonthlyBalanceRepository } from "./cached-monthly-balance.repository";
import { cache } from "../cache/memory-cache";
import { MonthlyBalance } from "@/domain/entities/monthly-balance.entity";
describe("CachedMonthlyBalanceRepository", () => {
  let repository: CachedMonthlyBalanceRepository;

  beforeEach(() => {
    repository = new CachedMonthlyBalanceRepository();
    cache.clear();
  });

  describe("findByAccountAndMonth", () => {
    it("should cache monthly balance after first call", async () => {
      // Arrange
      const accountId = "account-id";
      const year = 2024;
      const month = 1;
      const balance = MonthlyBalance.create(
        "id",
        accountId,
        year,
        month,
        5000,
        3000,
        1500
      );

      repository["repository"].findByAccountAndMonth = mock(() =>
        Promise.resolve(balance)
      );

      // Act
      const result1 = await repository.findByAccountAndMonth(
        accountId,
        year,
        month
      );
      const result2 = await repository.findByAccountAndMonth(
        accountId,
        year,
        month
      );

      // Assert
      expect(result1).toEqual(balance);
      expect(result2).toEqual(balance);
      expect(
        repository["repository"].findByAccountAndMonth
      ).toHaveBeenCalledTimes(1);
    });
  });

  describe("findByAccountAndYear", () => {
    it("should cache yearly balances", async () => {
      // Arrange
      const accountId = "account-id";
      const year = 2024;
      const balances = [
        MonthlyBalance.create("id1", accountId, year, 1, 5000, 3000, 1500),
        MonthlyBalance.create("id2", accountId, year, 2, 4500, 2800, 1200),
      ];

      repository["repository"].findByAccountAndYear = mock(() =>
        Promise.resolve(balances)
      );

      // Act
      const result1 = await repository.findByAccountAndYear(accountId, year);
      const result2 = await repository.findByAccountAndYear(accountId, year);

      // Assert
      expect(result1).toEqual(balances);
      expect(result2).toEqual(balances);
      expect(
        repository["repository"].findByAccountAndYear
      ).toHaveBeenCalledTimes(1);
    });
  });

  describe("save", () => {
    it("should invalidate cache after saving", async () => {
      // Arrange
      const balance = MonthlyBalance.create(
        "id",
        "account-id",
        2024,
        1,
        5000,
        3000,
        1500
      );

      cache.set(
        `monthly-balance:${balance.accountId}:${balance.year}:${balance.month}`,
        balance
      );
      repository["repository"].save = mock(() => Promise.resolve());

      // Act
      await repository.save(balance);

      // Assert
      expect(
        cache.get(
          `monthly-balance:${balance.accountId}:${balance.year}:${balance.month}`
        )
      ).toBeNull();
    });
  });
});
