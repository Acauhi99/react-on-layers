import { IMonthlyBalanceRepository } from "../../domain/repositories/monthly-balance.repository.interface.js";
import { MonthlyBalance } from "../../domain/entities/monthly-balance.entity.js";
import { db } from "../database/sqlite.js";

interface MonthlyBalanceData {
  id: string;
  account_id: string;
  year: number;
  month: number;
  total_income: number;
  total_expenses: number;
  net_balance: number;
  total_investments: number;
  available_to_invest: number;
  created_at: string;
  modified_at: string;
}

export class MonthlyBalanceRepositoryImpl implements IMonthlyBalanceRepository {
  async save(balance: MonthlyBalance): Promise<void> {
    db.run(
      `
      INSERT OR REPLACE INTO monthly_balances
      (id, account_id, year, month, total_income, total_expenses, net_balance, total_investments, available_to_invest, created_at, modified_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
      [
        balance.id,
        balance.accountId,
        balance.year,
        balance.month,
        balance.totalIncome,
        balance.totalExpenses,
        balance.netBalance,
        balance.totalInvestments,
        balance.availableToInvest,
        balance.createdAt.toISOString(),
        balance.modifiedAt.toISOString(),
      ]
    );
  }

  async findByAccountAndMonth(
    accountId: string,
    year: number,
    month: number
  ): Promise<MonthlyBalance | null> {
    const data = db.get<MonthlyBalanceData>(
      `
      SELECT * FROM monthly_balances WHERE account_id = ? AND year = ? AND month = ?
    `,
      [accountId, year, month]
    );
    return data ? this.toDomain(data) : null;
  }

  async findByAccountId(
    accountId: string,
    limit?: number
  ): Promise<MonthlyBalance[]> {
    const sql = `
      SELECT * FROM monthly_balances WHERE account_id = ?
      ORDER BY year DESC, month DESC
      ${limit ? "LIMIT ?" : ""}
    `;
    const params = limit ? [accountId, limit] : [accountId];
    const data = db.all<MonthlyBalanceData>(sql, params);
    return data.map((item) => this.toDomain(item));
  }

  async findByAccountAndYear(
    accountId: string,
    year: number
  ): Promise<MonthlyBalance[]> {
    const data = db.all<MonthlyBalanceData>(
      `
      SELECT * FROM monthly_balances WHERE account_id = ? AND year = ? ORDER BY month
    `,
      [accountId, year]
    );
    return data.map((item) => this.toDomain(item));
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
    const result = db.get<{
      totalIncome: number;
      totalExpenses: number;
      netBalance: number;
      totalInvestments: number;
    }>(
      `
      SELECT
        COALESCE(SUM(total_income), 0) as totalIncome,
        COALESCE(SUM(total_expenses), 0) as totalExpenses,
        COALESCE(SUM(net_balance), 0) as netBalance,
        COALESCE(SUM(total_investments), 0) as totalInvestments
      FROM monthly_balances WHERE account_id = ? AND year = ?
    `,
      [accountId, year]
    );
    return (
      result || {
        totalIncome: 0,
        totalExpenses: 0,
        netBalance: 0,
        totalInvestments: 0,
      }
    );
  }

  private toDomain(data: MonthlyBalanceData): MonthlyBalance {
    return new MonthlyBalance(
      data.id,
      data.account_id,
      data.year,
      data.month,
      data.total_income,
      data.total_expenses,
      data.net_balance,
      data.total_investments,
      data.available_to_invest,
      new Date(data.created_at),
      new Date(data.modified_at)
    );
  }
}
