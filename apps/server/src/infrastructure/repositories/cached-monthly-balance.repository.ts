import { IMonthlyBalanceRepository } from "@/domain/repositories/monthly-balance.repository.interface.js";
import { cache } from "../cache/memory-cache.js";
import { MonthlyBalanceRepositoryImpl } from "./monthly-balance.repository.impl.js";
import { MonthlyBalance } from "@/domain/entities/monthly-balance.entity.js";

export class CachedMonthlyBalanceRepository
  implements IMonthlyBalanceRepository
{
  private repository = new MonthlyBalanceRepositoryImpl();
  private cacheTTL = 30 * 60 * 1000; // 30 minutes

  async save(balance: MonthlyBalance): Promise<void> {
    await this.repository.save(balance);
    cache.invalidatePattern(`monthly-balance:${balance.accountId}`);
  }

  async findByAccountAndMonth(
    accountId: string,
    year: number,
    month: number
  ): Promise<MonthlyBalance | null> {
    const cacheKey = `monthly-balance:${accountId}:${year}:${month}`;
    let balance = cache.get<MonthlyBalance>(cacheKey);

    if (!balance) {
      balance = await this.repository.findByAccountAndMonth(
        accountId,
        year,
        month
      );
      if (balance) {
        cache.set(cacheKey, balance, this.cacheTTL);
      }
    }

    return balance;
  }

  async findByAccountId(
    accountId: string,
    limit?: number
  ): Promise<MonthlyBalance[]> {
    const cacheKey = `monthly-balances:${accountId}:${limit || "all"}`;
    let balances = cache.get<MonthlyBalance[]>(cacheKey);

    if (!balances) {
      balances = await this.repository.findByAccountId(accountId, limit);
      cache.set(cacheKey, balances, this.cacheTTL);
    }

    return balances;
  }

  async findByAccountAndYear(
    accountId: string,
    year: number
  ): Promise<MonthlyBalance[]> {
    const cacheKey = `monthly-balances:${accountId}:${year}`;
    let balances = cache.get<MonthlyBalance[]>(cacheKey);

    if (!balances) {
      balances = await this.repository.findByAccountAndYear(accountId, year);
      cache.set(cacheKey, balances, this.cacheTTL);
    }

    return balances;
  }

  async getYearlyTotals(
    accountId: string,
    year: number
  ): Promise<{
    totalIncome: number;
    totalExpenses: number;
    netBalance: number;
    totalInvestments: number;
  }> {
    const cacheKey = `yearly-totals:${accountId}:${year}`;
    let totals = cache.get<{
      totalIncome: number;
      totalExpenses: number;
      netBalance: number;
      totalInvestments: number;
    }>(cacheKey);

    if (!totals) {
      totals = await this.repository.getYearlyTotals(accountId, year);
      cache.set(cacheKey, totals, this.cacheTTL);
    }

    return totals;
  }
}
