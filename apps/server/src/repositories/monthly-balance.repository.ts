import { db } from "../database/sqlite.js";

export interface MonthlyBalance {
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

export class MonthlyBalanceRepository {
  create(balance: Omit<MonthlyBalance, "created_at" | "modified_at">): void {
    db.run(
      `
      INSERT INTO monthly_balances
      (id, account_id, year, month, total_income, total_expenses, net_balance, total_investments, available_to_invest)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
      [
        balance.id,
        balance.account_id,
        balance.year,
        balance.month,
        balance.total_income,
        balance.total_expenses,
        balance.net_balance,
        balance.total_investments,
        balance.available_to_invest,
      ]
    );
  }

  upsert(balance: Omit<MonthlyBalance, "created_at" | "modified_at">): void {
    db.run(
      `
      INSERT OR REPLACE INTO monthly_balances
      (id, account_id, year, month, total_income, total_expenses, net_balance, total_investments, available_to_invest)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
      [
        balance.id,
        balance.account_id,
        balance.year,
        balance.month,
        balance.total_income,
        balance.total_expenses,
        balance.net_balance,
        balance.total_investments,
        balance.available_to_invest,
      ]
    );
  }

  findByAccountAndMonth(
    accountId: string,
    year: number,
    month: number
  ): MonthlyBalance | undefined {
    return db.get<MonthlyBalance>(
      `
      SELECT * FROM monthly_balances
      WHERE account_id = ? AND year = ? AND month = ?
    `,
      [accountId, year, month]
    );
  }

  findByAccountId(accountId: string, limit?: number): MonthlyBalance[] {
    const sql = `
      SELECT * FROM monthly_balances
      WHERE account_id = ?
      ORDER BY year DESC, month DESC
      ${limit ? "LIMIT ?" : ""}
    `;
    const params = limit ? [accountId, limit] : [accountId];
    return db.all<MonthlyBalance>(sql, params);
  }

  findByAccountAndYear(accountId: string, year: number): MonthlyBalance[] {
    return db.all<MonthlyBalance>(
      `
      SELECT * FROM monthly_balances
      WHERE account_id = ? AND year = ?
      ORDER BY month
    `,
      [accountId, year]
    );
  }

  update(
    id: string,
    data: Partial<
      Pick<
        MonthlyBalance,
        | "total_income"
        | "total_expenses"
        | "net_balance"
        | "total_investments"
        | "available_to_invest"
      >
    >
  ): void {
    const fields = Object.keys(data)
      .map((key) => `${key} = ?`)
      .join(", ");
    const values = Object.values(data);

    db.run(
      `
      UPDATE monthly_balances
      SET ${fields}, modified_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `,
      [...values, id]
    );
  }

  delete(id: string): void {
    db.run("DELETE FROM monthly_balances WHERE id = ?", [id]);
  }

  getYearlyTotals(
    accountId: string,
    year: number
  ): {
    total_income: number;
    total_expenses: number;
    net_balance: number;
    total_investments: number;
  } {
    const result = db.get<{
      total_income: number;
      total_expenses: number;
      net_balance: number;
      total_investments: number;
    }>(
      `
      SELECT
        COALESCE(SUM(total_income), 0) as total_income,
        COALESCE(SUM(total_expenses), 0) as total_expenses,
        COALESCE(SUM(net_balance), 0) as net_balance,
        COALESCE(SUM(total_investments), 0) as total_investments
      FROM monthly_balances
      WHERE account_id = ? AND year = ?
    `,
      [accountId, year]
    );

    return (
      result || {
        total_income: 0,
        total_expenses: 0,
        net_balance: 0,
        total_investments: 0,
      }
    );
  }
}
