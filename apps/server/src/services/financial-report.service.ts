import { MonthlyBalanceRepository } from "../repositories/monthly-balance.repository.js";
import { TransactionRepository } from "../repositories/transaction.repository.js";
import { InvestmentRepository } from "../repositories/investment.repository.js";
import { AccountRepository } from "../repositories/account.repository.js";

export interface MonthlyReport {
  year: number;
  month: number;
  income: number;
  expenses: number;
  net_balance: number;
  investments: number;
  available_to_invest: number;
}

export interface YearlyReport {
  year: number;
  total_income: number;
  total_expenses: number;
  net_balance: number;
  total_investments: number;
  monthly_data: MonthlyReport[];
}

export class FinancialReportService {
  private monthlyBalanceRepo = new MonthlyBalanceRepository();
  private transactionRepo = new TransactionRepository();
  private investmentRepo = new InvestmentRepository();
  private accountRepo = new AccountRepository();

  async generateMonthlyReport(
    accountId: string,
    year: number,
    month: number
  ): Promise<MonthlyReport> {
    const account = this.accountRepo.findById(accountId);
    if (!account) {
      throw new Error("Account not found");
    }

    // Get or calculate monthly data
    let monthlyBalance = this.monthlyBalanceRepo.findByAccountAndMonth(
      accountId,
      year,
      month
    );

    if (!monthlyBalance) {
      // Calculate and store monthly balance
      const transactionTotals = this.transactionRepo.getMonthlyTotals(
        accountId,
        year,
        month
      );
      const investmentTotal = this.investmentRepo.getMonthlyTotal(
        accountId,
        year,
        month
      );
      const netBalance = transactionTotals.income - transactionTotals.expenses;
      const availableToInvest = netBalance - investmentTotal;

      const balance = {
        id: `${accountId}-${year}-${month}`,
        account_id: accountId,
        year,
        month,
        total_income: transactionTotals.income,
        total_expenses: transactionTotals.expenses,
        net_balance: netBalance,
        total_investments: investmentTotal,
        available_to_invest: availableToInvest,
      };

      this.monthlyBalanceRepo.upsert(balance);
      monthlyBalance = this.monthlyBalanceRepo.findByAccountAndMonth(
        accountId,
        year,
        month
      )!;
    }

    return {
      year: monthlyBalance.year,
      month: monthlyBalance.month,
      income: monthlyBalance.total_income,
      expenses: monthlyBalance.total_expenses,
      net_balance: monthlyBalance.net_balance,
      investments: monthlyBalance.total_investments,
      available_to_invest: monthlyBalance.available_to_invest,
    };
  }

  async getMonthlyReports(
    accountId: string,
    limit?: number
  ): Promise<MonthlyReport[]> {
    const balances = this.monthlyBalanceRepo.findByAccountId(accountId, limit);

    return balances.map((balance) => ({
      year: balance.year,
      month: balance.month,
      income: balance.total_income,
      expenses: balance.total_expenses,
      net_balance: balance.net_balance,
      investments: balance.total_investments,
      available_to_invest: balance.available_to_invest,
    }));
  }

  async generateYearlyReport(
    accountId: string,
    year: number
  ): Promise<YearlyReport> {
    const account = this.accountRepo.findById(accountId);
    if (!account) {
      throw new Error("Account not found");
    }

    const monthlyBalances = this.monthlyBalanceRepo.findByAccountAndYear(
      accountId,
      year
    );
    const yearlyTotals = this.monthlyBalanceRepo.getYearlyTotals(
      accountId,
      year
    );

    const monthlyData: MonthlyReport[] = monthlyBalances.map((balance) => ({
      year: balance.year,
      month: balance.month,
      income: balance.total_income,
      expenses: balance.total_expenses,
      net_balance: balance.net_balance,
      investments: balance.total_investments,
      available_to_invest: balance.available_to_invest,
    }));

    return {
      year,
      total_income: yearlyTotals.total_income,
      total_expenses: yearlyTotals.total_expenses,
      net_balance: yearlyTotals.net_balance,
      total_investments: yearlyTotals.total_investments,
      monthly_data: monthlyData,
    };
  }

  async updateMonthlyBalance(
    accountId: string,
    year: number,
    month: number
  ): Promise<void> {
    const transactionTotals = this.transactionRepo.getMonthlyTotals(
      accountId,
      year,
      month
    );
    const investmentTotal = this.investmentRepo.getMonthlyTotal(
      accountId,
      year,
      month
    );
    const netBalance = transactionTotals.income - transactionTotals.expenses;
    const availableToInvest = netBalance - investmentTotal;

    const balance = {
      id: `${accountId}-${year}-${month}`,
      account_id: accountId,
      year,
      month,
      total_income: transactionTotals.income,
      total_expenses: transactionTotals.expenses,
      net_balance: netBalance,
      total_investments: investmentTotal,
      available_to_invest: availableToInvest,
    };

    this.monthlyBalanceRepo.upsert(balance);
  }
}
