import {
  TransactionRepository,
  type Transaction,
  type TransactionWithCategory,
} from "../repositories/transaction.repository.js";
import { CategoryRepository } from "../repositories/category.repository.js";
import { AccountRepository } from "../repositories/account.repository.js";
import { randomUUID } from "crypto";

export class TransactionService {
  private transactionRepo = new TransactionRepository();
  private categoryRepo = new CategoryRepository();
  private accountRepo = new AccountRepository();

  async createTransaction(
    accountId: string,
    amount: number,
    description: string,
    categoryId: string,
    date: string
  ): Promise<Transaction> {
    const account = this.accountRepo.findById(accountId);
    if (!account) {
      throw new Error("Account not found");
    }

    const category = this.categoryRepo.findById(categoryId);
    if (!category || category.account_id !== accountId) {
      throw new Error("Category not found or does not belong to account");
    }

    const transaction = {
      id: randomUUID(),
      account_id: accountId,
      amount,
      description,
      category_id: categoryId,
      date,
    };

    this.transactionRepo.create(transaction);
    return this.transactionRepo.findById(transaction.id)!;
  }

  async getTransactionsByAccount(
    accountId: string,
    limit?: number
  ): Promise<TransactionWithCategory[]> {
    return this.transactionRepo.findByAccountId(accountId, limit);
  }

  async getTransactionsByDateRange(
    accountId: string,
    startDate: string,
    endDate: string
  ): Promise<TransactionWithCategory[]> {
    return this.transactionRepo.findByAccountAndDateRange(
      accountId,
      startDate,
      endDate
    );
  }

  async getTransactionsByMonth(
    accountId: string,
    year: number,
    month: number
  ): Promise<TransactionWithCategory[]> {
    return this.transactionRepo.findByAccountAndMonth(accountId, year, month);
  }

  async getTransactionById(id: string): Promise<Transaction | null> {
    return this.transactionRepo.findById(id) || null;
  }

  async updateTransaction(
    id: string,
    data: {
      amount?: number;
      description?: string;
      category_id?: string;
      date?: string;
    }
  ): Promise<Transaction> {
    const transaction = this.transactionRepo.findById(id);
    if (!transaction) {
      throw new Error("Transaction not found");
    }

    if (data.category_id) {
      const category = this.categoryRepo.findById(data.category_id);
      if (!category || category.account_id !== transaction.account_id) {
        throw new Error("Category not found or does not belong to account");
      }
    }

    this.transactionRepo.update(id, data);
    return this.transactionRepo.findById(id)!;
  }

  async deleteTransaction(id: string): Promise<void> {
    const transaction = this.transactionRepo.findById(id);
    if (!transaction) {
      throw new Error("Transaction not found");
    }

    this.transactionRepo.delete(id);
  }

  async getMonthlyTotals(
    accountId: string,
    year: number,
    month: number
  ): Promise<{ income: number; expenses: number; balance: number }> {
    const totals = this.transactionRepo.getMonthlyTotals(
      accountId,
      year,
      month
    );
    return {
      ...totals,
      balance: totals.income - totals.expenses,
    };
  }
}
