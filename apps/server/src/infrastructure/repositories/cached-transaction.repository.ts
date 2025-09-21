import { ITransactionRepository } from "@/domain/repositories/transaction.repository.interface.js";
import { cache } from "../cache/memory-cache.js";
import { TransactionRepositoryImpl } from "./transaction.repository.impl.js";
import { Transaction } from "@/domain/entities/transaction.entity.js";

export class CachedTransactionRepository implements ITransactionRepository {
  private repository = new TransactionRepositoryImpl();
  private cacheTTL = 2 * 60 * 1000; // 2 minutes (shorter for frequently changing data)

  async save(transaction: Transaction): Promise<void> {
    await this.repository.save(transaction);
    cache.invalidatePattern(`transactions:${transaction.accountId}`);
    cache.invalidatePattern(`monthly-totals:${transaction.accountId}`);
  }

  async findById(id: string): Promise<Transaction | null> {
    return this.repository.findById(id);
  }

  async findByAccountId(
    accountId: string,
    limit?: number
  ): Promise<Transaction[]> {
    const cacheKey = `transactions:${accountId}:${limit || "all"}`;
    let transactions = cache.get<Transaction[]>(cacheKey);

    if (!transactions) {
      transactions = await this.repository.findByAccountId(accountId, limit);
      cache.set(cacheKey, transactions, this.cacheTTL);
    }

    return transactions;
  }

  async findByAccountAndMonth(
    accountId: string,
    year: number,
    month: number
  ): Promise<Transaction[]> {
    const cacheKey = `transactions:${accountId}:${year}:${month}`;
    let transactions = cache.get<Transaction[]>(cacheKey);

    if (!transactions) {
      transactions = await this.repository.findByAccountAndMonth(
        accountId,
        year,
        month
      );
      cache.set(cacheKey, transactions, this.cacheTTL);
    }

    return transactions;
  }

  async findByAccountAndDateRange(
    accountId: string,
    startDate: Date,
    endDate: Date
  ): Promise<Transaction[]> {
    return this.repository.findByAccountAndDateRange(
      accountId,
      startDate,
      endDate
    );
  }

  async update(transaction: Transaction): Promise<void> {
    await this.repository.update(transaction);
    cache.invalidatePattern(`transactions:${transaction.accountId}`);
    cache.invalidatePattern(`monthly-totals:${transaction.accountId}`);
  }

  async delete(id: string): Promise<void> {
    const transaction = await this.findById(id);
    await this.repository.delete(id);

    if (transaction) {
      cache.invalidatePattern(`transactions:${transaction.accountId}`);
      cache.invalidatePattern(`monthly-totals:${transaction.accountId}`);
    }
  }

  async getMonthlyTotals(
    accountId: string,
    year: number,
    month: number
  ): Promise<{ income: number; expenses: number }> {
    const cacheKey = `monthly-totals:${accountId}:${year}:${month}`;
    let totals = cache.get<{ income: number; expenses: number }>(cacheKey);

    if (!totals) {
      totals = await this.repository.getMonthlyTotals(accountId, year, month);
      cache.set(cacheKey, totals, this.cacheTTL);
    }

    return totals;
  }
}
