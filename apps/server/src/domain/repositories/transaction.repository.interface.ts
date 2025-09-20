import { Transaction } from "../entities/transaction.entity.js";

export interface ITransactionRepository {
  save(transaction: Transaction): Promise<void>;
  findById(id: string): Promise<Transaction | null>;
  findByAccountId(accountId: string, limit?: number): Promise<Transaction[]>;
  findByAccountAndMonth(
    accountId: string,
    year: number,
    month: number
  ): Promise<Transaction[]>;
  findByAccountAndDateRange(
    accountId: string,
    startDate: Date,
    endDate: Date
  ): Promise<Transaction[]>;
  update(transaction: Transaction): Promise<void>;
  delete(id: string): Promise<void>;
  getMonthlyTotals(
    accountId: string,
    year: number,
    month: number
  ): Promise<{ income: number; expenses: number }>;
}
