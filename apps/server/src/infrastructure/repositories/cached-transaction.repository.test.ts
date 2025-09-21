import { describe, it, expect, mock, beforeEach } from "bun:test";
import { CachedTransactionRepository } from "./cached-transaction.repository";
import { cache } from "../cache/memory-cache";
import { Transaction } from "@/domain/entities/transaction.entity";

describe("CachedTransactionRepository", () => {
  let repository: CachedTransactionRepository;

  beforeEach(() => {
    repository = new CachedTransactionRepository();
    cache.clear();
  });

  describe("findByAccountId", () => {
    it("should cache transactions after first call", async () => {
      // Arrange
      const accountId = "account-id";
      const transactions = [
        Transaction.create("txn1", accountId, 100, "Food", "cat1", new Date()),
        Transaction.create("txn2", accountId, 200, "Gas", "cat2", new Date()),
      ];

      repository["repository"].findByAccountId = mock(() =>
        Promise.resolve(transactions)
      );

      // Act
      const result1 = await repository.findByAccountId(accountId);
      const result2 = await repository.findByAccountId(accountId);

      // Assert
      expect(result1).toEqual(transactions);
      expect(result2).toEqual(transactions);
      expect(repository["repository"].findByAccountId).toHaveBeenCalledTimes(1);
    });

    it("should cache with different keys for different limits", async () => {
      // Arrange
      const accountId = "account-id";
      const allTransactions = [
        Transaction.create("txn1", accountId, 100, "Food", "cat1", new Date()),
        Transaction.create("txn2", accountId, 200, "Gas", "cat2", new Date()),
      ];
      const limitedTransactions = [allTransactions[0]];

      repository["repository"].findByAccountId = mock((id, limit) => {
        if (limit === 1) return Promise.resolve(limitedTransactions);
        return Promise.resolve(allTransactions);
      });

      // Act
      const resultAll = await repository.findByAccountId(accountId);
      const resultLimited = await repository.findByAccountId(accountId, 1);

      // Assert
      expect(resultAll).toHaveLength(2);
      expect(resultLimited).toHaveLength(1);
      expect(repository["repository"].findByAccountId).toHaveBeenCalledTimes(2);
    });
  });

  describe("getMonthlyTotals", () => {
    it("should cache monthly totals", async () => {
      // Arrange
      const accountId = "account-id";
      const year = 2024;
      const month = 1;
      const totals = { income: 5000, expenses: 3000 };

      repository["repository"].getMonthlyTotals = mock(() =>
        Promise.resolve(totals)
      );

      // Act
      const result1 = await repository.getMonthlyTotals(accountId, year, month);
      const result2 = await repository.getMonthlyTotals(accountId, year, month);

      // Assert
      expect(result1).toEqual(totals);
      expect(result2).toEqual(totals);
      expect(repository["repository"].getMonthlyTotals).toHaveBeenCalledTimes(
        1
      );
    });
  });

  describe("save", () => {
    it("should invalidate related caches after saving", async () => {
      // Arrange
      const transaction = Transaction.create(
        "txn1",
        "account-id",
        100,
        "Food",
        "cat1",
        new Date()
      );

      cache.set(`transactions:${transaction.accountId}`, [transaction]);
      cache.set(`monthly-totals:${transaction.accountId}:2024:1`, {
        income: 100,
        expenses: 0,
      });
      repository["repository"].save = mock(() => Promise.resolve());

      // Act
      await repository.save(transaction);

      // Assert
      expect(cache.get(`transactions:${transaction.accountId}`)).toBeNull();
      expect(
        cache.get(`monthly-totals:${transaction.accountId}:2024:1`)
      ).toBeNull();
    });
  });

  describe("update", () => {
    it("should invalidate caches after update", async () => {
      // Arrange
      const transaction = Transaction.create(
        "txn1",
        "account-id",
        100,
        "Food",
        "cat1",
        new Date()
      );

      cache.set(`transactions:${transaction.accountId}`, [transaction]);
      repository["repository"].update = mock(() => Promise.resolve());

      // Act
      await repository.update(transaction);

      // Assert
      expect(cache.get(`transactions:${transaction.accountId}`)).toBeNull();
    });
  });
});
