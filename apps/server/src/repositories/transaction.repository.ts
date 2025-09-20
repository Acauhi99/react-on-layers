import { db } from "../database/sqlite.js";

export interface Transaction {
  id: string;
  account_id: string;
  amount: number;
  description: string;
  category_id: string;
  date: string;
  created_at: string;
  modified_at: string;
}

export interface TransactionWithCategory extends Transaction {
  category_name: string;
  category_type: "income" | "expense";
}

export class TransactionRepository {
  create(transaction: Omit<Transaction, "created_at" | "modified_at">): void {
    db.run(
      `
      INSERT INTO transactions (id, account_id, amount, description, category_id, date)
      VALUES (?, ?, ?, ?, ?, ?)
    `,
      [
        transaction.id,
        transaction.account_id,
        transaction.amount,
        transaction.description,
        transaction.category_id,
        transaction.date,
      ]
    );
  }

  findByAccountId(
    accountId: string,
    limit?: number
  ): TransactionWithCategory[] {
    const sql = `
      SELECT t.*, c.name as category_name, c.type as category_type
      FROM transactions t
      JOIN categories c ON t.category_id = c.id
      WHERE t.account_id = ?
      ORDER BY t.date DESC, t.created_at DESC
      ${limit ? "LIMIT ?" : ""}
    `;
    const params = limit ? [accountId, limit] : [accountId];
    return db.all<TransactionWithCategory>(sql, params);
  }

  findByAccountAndDateRange(
    accountId: string,
    startDate: string,
    endDate: string
  ): TransactionWithCategory[] {
    return db.all<TransactionWithCategory>(
      `
      SELECT t.*, c.name as category_name, c.type as category_type
      FROM transactions t
      JOIN categories c ON t.category_id = c.id
      WHERE t.account_id = ? AND t.date BETWEEN ? AND ?
      ORDER BY t.date DESC
    `,
      [accountId, startDate, endDate]
    );
  }

  findByAccountAndMonth(
    accountId: string,
    year: number,
    month: number
  ): TransactionWithCategory[] {
    return db.all<TransactionWithCategory>(
      `
      SELECT t.*, c.name as category_name, c.type as category_type
      FROM transactions t
      JOIN categories c ON t.category_id = c.id
      WHERE t.account_id = ?
      AND strftime('%Y', t.date) = ?
      AND strftime('%m', t.date) = ?
      ORDER BY t.date DESC
    `,
      [accountId, year.toString(), month.toString().padStart(2, "0")]
    );
  }

  findById(id: string): Transaction | undefined {
    return db.get<Transaction>(
      `
      SELECT * FROM transactions WHERE id = ?
    `,
      [id]
    );
  }

  update(
    id: string,
    data: Partial<
      Pick<Transaction, "amount" | "description" | "category_id" | "date">
    >
  ): void {
    const fields = Object.keys(data)
      .map((key) => `${key} = ?`)
      .join(", ");
    const values = Object.values(data);

    db.run(
      `
      UPDATE transactions
      SET ${fields}, modified_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `,
      [...values, id]
    );
  }

  delete(id: string): void {
    db.run("DELETE FROM transactions WHERE id = ?", [id]);
  }

  getMonthlyTotals(
    accountId: string,
    year: number,
    month: number
  ): { income: number; expenses: number } {
    const result = db.get<{ income: number; expenses: number }>(
      `
      SELECT
        COALESCE(SUM(CASE WHEN c.type = 'income' THEN t.amount ELSE 0 END), 0) as income,
        COALESCE(SUM(CASE WHEN c.type = 'expense' THEN t.amount ELSE 0 END), 0) as expenses
      FROM transactions t
      JOIN categories c ON t.category_id = c.id
      WHERE t.account_id = ?
      AND strftime('%Y', t.date) = ?
      AND strftime('%m', t.date) = ?
    `,
      [accountId, year.toString(), month.toString().padStart(2, "0")]
    );

    return result || { income: 0, expenses: 0 };
  }
}
