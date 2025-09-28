import { api } from "@/lib/api";
import type { Transaction, Category } from "@/types/financial";

// Camada de Regras de Negócio
export class FinancialService {
  // Transactions
  async createTransaction(
    data: Omit<Transaction, "id" | "createdAt">
  ): Promise<Transaction> {
    return api.post<Transaction>("/api/transactions", data);
  }

  async getTransactions(): Promise<Transaction[]> {
    return api.get<Transaction[]>("/api/transactions");
  }

  // Categories
  async createCategory(data: Omit<Category, "id">): Promise<Category> {
    return api.post<Category>("/api/categories", data);
  }

  async getCategories(): Promise<Category[]> {
    return api.get<Category[]>("/api/categories");
  }

  // Balance
  async getBalance(): Promise<{
    income: number;
    expenses: number;
    total: number;
  }> {
    return api.get<{ income: number; expenses: number; total: number }>(
      "/api/balance"
    );
  }

  // Investment Projections
  calculateInvestmentProjection(
    monthlyAmount: number,
    annualReturn: number,
    years: number
  ): { month: number; amount: number }[] {
    const monthlyReturn = annualReturn / 12 / 100;
    const projection = [];
    let total = 0;

    for (let month = 1; month <= years * 12; month++) {
      total = (total + monthlyAmount) * (1 + monthlyReturn);
      projection.push({ month, amount: Math.round(total) });
    }

    return projection;
  }
}

export const financialService = new FinancialService();
