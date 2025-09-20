import { describe, it, expect, mock, beforeEach } from "bun:test";
import { CachedInvestmentRepository } from "../../../../src/infrastructure/repositories/cached-investment.repository.js";
import { Investment } from "../../../../src/domain/entities/investment.entity.js";
import { cache } from "../../../../src/infrastructure/cache/memory-cache.js";

describe("CachedInvestmentRepository", () => {
  let repository: CachedInvestmentRepository;

  beforeEach(() => {
    repository = new CachedInvestmentRepository();
    cache.clear();
  });

  describe("findByAccountId", () => {
    it("should cache investments after first call", async () => {
      // Arrange
      const accountId = "account-id";
      const investments = [
        Investment.create(
          "inv1",
          accountId,
          "AAPL",
          "stocks",
          1000,
          new Date()
        ),
        Investment.create(
          "inv2",
          accountId,
          "GOOGL",
          "stocks",
          2000,
          new Date()
        ),
      ];

      repository["repository"].findByAccountId = mock(() =>
        Promise.resolve(investments)
      );

      // Act
      const result1 = await repository.findByAccountId(accountId);
      const result2 = await repository.findByAccountId(accountId);

      // Assert
      expect(result1).toEqual(investments);
      expect(result2).toEqual(investments);
      expect(repository["repository"].findByAccountId).toHaveBeenCalledTimes(1);
    });
  });

  describe("getAccountTotal", () => {
    it("should cache total amount", async () => {
      // Arrange
      const accountId = "account-id";
      const total = 15000;

      repository["repository"].getAccountTotal = mock(() =>
        Promise.resolve(total)
      );

      // Act
      const result1 = await repository.getAccountTotal(accountId);
      const result2 = await repository.getAccountTotal(accountId);

      // Assert
      expect(result1).toBe(total);
      expect(result2).toBe(total);
      expect(repository["repository"].getAccountTotal).toHaveBeenCalledTimes(1);
    });
  });

  describe("getAccountAllocation", () => {
    it("should cache allocation data", async () => {
      // Arrange
      const accountId = "account-id";
      const allocation = [
        { type_name: "Stocks", total_amount: 10000, count: 5 },
        { type_name: "Bonds", total_amount: 5000, count: 3 },
      ];

      repository["repository"].getAccountAllocation = mock(() =>
        Promise.resolve(allocation)
      );

      // Act
      const result1 = await repository.getAccountAllocation(accountId);
      const result2 = await repository.getAccountAllocation(accountId);

      // Assert
      expect(result1).toEqual(allocation);
      expect(result2).toEqual(allocation);
      expect(
        repository["repository"].getAccountAllocation
      ).toHaveBeenCalledTimes(1);
    });
  });

  describe("save", () => {
    it("should invalidate cache after saving", async () => {
      // Arrange
      const investment = Investment.create(
        "inv1",
        "account-id",
        "AAPL",
        "stocks",
        1000,
        new Date()
      );

      cache.set(`investments:${investment.accountId}`, [investment]);
      repository["repository"].save = mock(() => Promise.resolve());

      // Act
      await repository.save(investment);

      // Assert
      expect(cache.get(`investments:${investment.accountId}`)).toBeNull();
    });
  });
});
