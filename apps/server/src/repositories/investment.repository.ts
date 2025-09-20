import { db } from "../database/sqlite.js";

export interface InvestmentType {
  id: string;
  name: string;
  description: string | null;
}

export interface Investment {
  id: string;
  account_id: string;
  name: string;
  investment_type_id: string;
  amount: number;
  date: string;
  created_at: string;
  modified_at: string;
}

export interface InvestmentWithType extends Investment {
  type_name: string;
  type_description: string | null;
}

export class InvestmentRepository {
  // Investment Types
  getAllTypes(): InvestmentType[] {
    return db.all<InvestmentType>(`
      SELECT * FROM investment_types ORDER BY name
    `);
  }

  // Investments
  create(investment: Omit<Investment, "created_at" | "modified_at">): void {
    db.run(
      `
      INSERT INTO investments (id, account_id, name, investment_type_id, amount, date)
      VALUES (?, ?, ?, ?, ?, ?)
    `,
      [
        investment.id,
        investment.account_id,
        investment.name,
        investment.investment_type_id,
        investment.amount,
        investment.date,
      ]
    );
  }

  findByAccountId(accountId: string): InvestmentWithType[] {
    return db.all<InvestmentWithType>(
      `
      SELECT i.*, it.name as type_name, it.description as type_description
      FROM investments i
      JOIN investment_types it ON i.investment_type_id = it.id
      WHERE i.account_id = ?
      ORDER BY i.date DESC
    `,
      [accountId]
    );
  }

  findByAccountAndType(accountId: string, typeId: string): Investment[] {
    return db.all<Investment>(
      `
      SELECT * FROM investments
      WHERE account_id = ? AND investment_type_id = ?
      ORDER BY date DESC
    `,
      [accountId, typeId]
    );
  }

  findById(id: string): Investment | undefined {
    return db.get<Investment>(
      `
      SELECT * FROM investments WHERE id = ?
    `,
      [id]
    );
  }

  update(
    id: string,
    data: Partial<
      Pick<Investment, "name" | "investment_type_id" | "amount" | "date">
    >
  ): void {
    const fields = Object.keys(data)
      .map((key) => `${key} = ?`)
      .join(", ");
    const values = Object.values(data);

    db.run(
      `
      UPDATE investments
      SET ${fields}, modified_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `,
      [...values, id]
    );
  }

  delete(id: string): void {
    db.run("DELETE FROM investments WHERE id = ?", [id]);
  }

  getAccountTotal(accountId: string): number {
    const result = db.get<{ total: number }>(
      `
      SELECT COALESCE(SUM(amount), 0) as total
      FROM investments
      WHERE account_id = ?
    `,
      [accountId]
    );

    return result?.total || 0;
  }

  getAccountAllocation(
    accountId: string
  ): Array<{ type_name: string; total_amount: number; count: number }> {
    return db.all<{ type_name: string; total_amount: number; count: number }>(
      `
      SELECT
        it.name as type_name,
        SUM(i.amount) as total_amount,
        COUNT(i.id) as count
      FROM investments i
      JOIN investment_types it ON i.investment_type_id = it.id
      WHERE i.account_id = ?
      GROUP BY it.id, it.name
      ORDER BY total_amount DESC
    `,
      [accountId]
    );
  }

  getMonthlyTotal(accountId: string, year: number, month: number): number {
    const result = db.get<{ total: number }>(
      `
      SELECT COALESCE(SUM(amount), 0) as total
      FROM investments
      WHERE account_id = ?
      AND strftime('%Y', date) = ?
      AND strftime('%m', date) = ?
    `,
      [accountId, year.toString(), month.toString().padStart(2, "0")]
    );

    return result?.total || 0;
  }
}
