import { MonthlyBalance } from "../entities/monthly-balance.entity.js";

export interface IMonthlyBalanceRepository {
  save(balance: MonthlyBalance): Promise<void>;
  findByAccountAndMonth(
    accountId: string,
    year: number,
    month: number
  ): Promise<MonthlyBalance | null>;
  findByAccountId(accountId: string, limit?: number): Promise<MonthlyBalance[]>;
  findByAccountAndYear(
    accountId: string,
    year: number
  ): Promise<MonthlyBalance[]>;
  getYearlyTotals(
    accountId: string,
    year: number
  ): Promise<{
    totalIncome: number;
    totalExpenses: number;
    netBalance: number;
    totalInvestments: number;
  }>;
}
