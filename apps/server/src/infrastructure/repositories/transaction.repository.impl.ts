import { ITransactionRepository } from "../../domain/repositories/transaction.repository.interface.js";
import { Transaction } from "../../domain/entities/transaction.entity.js";
import { db } from "../database/sqlite.js";

interface TransactionData {
  id: string;
  account_id: string;
  amount: number;
  description: string;
  category_id: string;
  date: string;
  created_at: string;
  modified_at: string;
}

export class TransactionRepositoryImpl implements ITransactionRepository {
  async save(transaction: Transaction): Promise<void> {
    db.run(
      `
      INSERT INTO transactions (id, account_id, amount, description, category_id, date, created_at, modified_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `,
      [
        transaction.id,
        transaction.accountId,
        transaction.amount,
        transaction.description,
        transaction.categoryId,
        transaction.date.toISOString().split("T")[0],
        transaction.createdAt.toISOString(),
        transaction.modifiedAt.toISOString(),
      ]
    );
  }

  async findById(id: string): Promise<Transaction | null> {
    const data = db.get<TransactionData>(
      `
      SELECT * FROM transactions WHERE id = ?
    `,
      [id]
    );

    return data ? this.toDomain(data) : null;
  }

  async findByAccountId(
    accountId: string,
    limit?: number
  ): Promise<Transaction[]> {
    const sql = `
      SELECT * FROM transactions
      WHERE account_id = ?
      ORDER BY date DESC, created_at DESC
      ${limit ? "LIMIT ?" : ""}
    `;
    const params = limit ? [accountId, limit] : [accountId];
    const data = db.all<TransactionData>(sql, params);

    return data.map((item) => this.toDomain(item));
  }

  async findByAccountAndMonth(
    accountId: string,
    year: number,
    month: number
  ): Promise<Transaction[]> {
    const data = db.all<TransactionData>(
      `
      SELECT * FROM transactions
      WHERE account_id = ?
      AND strftime('%Y', date) = ?
      AND strftime('%m', date) = ?
      ORDER BY date DESC
    `,
      [accountId, year.toString(), month.toString().padStart(2, "0")]
    );

    return data.map((item) => this.toDomain(item));
  }

  async update(transaction: Transaction): Promise<void> {
    db.run(
      `
      UPDATE transactions
      SET amount = ?, description = ?, category_id = ?, date = ?, modified_at = ?
      WHERE id = ?
    `,
      [
        transaction.amount,
        transaction.description,
        transaction.categoryId,
        transaction.date.toISOString().split("T")[0],
        transaction.modifiedAt.toISOString(),
        transaction.id,
      ]
    );
  }

  async delete(id: string): Promise<void> {
    db.run("DELETE FROM transactions WHERE id = ?", [id]);
  }

  async getMonthlyTotals(
    accountId: string,
    year: number,
    month: number
  ): Promise<{ income: number; expenses: number }> {
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

  private toDomain(data: TransactionData): Transaction {
    return new Transaction(
      data.id,
      data.account_id,
      data.amount,
      data.description,
      data.category_id,
      new Date(data.date),
      new Date(data.created_at),
      new Date(data.modified_at)
    );
  }
}
