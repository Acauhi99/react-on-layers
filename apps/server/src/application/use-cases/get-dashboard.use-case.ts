import { ITransactionRepository } from "../../domain/repositories/transaction.repository.interface.js";
import { IInvestmentRepository } from "../../domain/repositories/investment.repository.interface.js";
import { ICategoryRepository } from "../../domain/repositories/category.repository.interface.js";

export interface GetDashboardRequest {
  accountId: string;
  year?: number;
  month?: number;
}

export interface DashboardResponse {
  currentMonth: {
    income: number;
    expenses: number;
    balance: number;
    investments: number;
  };
  totalInvestments: number;
  investmentAllocation: Array<{
    typeName: string;
    totalAmount: number;
    count: number;
    percentage: number;
  }>;
  recentTransactions: any[];
  categoriesCount: {
    income: number;
    expense: number;
  };
}

export class GetDashboardUseCase {
  constructor(
    private transactionRepository: ITransactionRepository,
    private investmentRepository: IInvestmentRepository,
    private categoryRepository: ICategoryRepository
  ) {}

  async execute(request: GetDashboardRequest): Promise<DashboardResponse> {
    const now = new Date();
    const year = request.year || now.getFullYear();
    const month = request.month || now.getMonth() + 1;

    // Current month totals
    const monthlyTotals = await this.transactionRepository.getMonthlyTotals(
      request.accountId,
      year,
      month
    );

    // Investment data
    const totalInvestments = await this.investmentRepository.getAccountTotal(
      request.accountId
    );
    const allocation = await this.investmentRepository.getAccountAllocation(
      request.accountId
    );

    const investmentAllocation = allocation.map((item) => ({
      typeName: item.type_name,
      totalAmount: item.total_amount,
      count: item.count,
      percentage:
        totalInvestments > 0 ? (item.total_amount / totalInvestments) * 100 : 0,
    }));

    // Recent transactions
    const recentTransactions = await this.transactionRepository.findByAccountId(
      request.accountId,
      5
    );

    // Categories count
    const incomeCategories = await this.categoryRepository.findByAccountAndType(
      request.accountId,
      "income"
    );
    const expenseCategories =
      await this.categoryRepository.findByAccountAndType(
        request.accountId,
        "expense"
      );

    return {
      currentMonth: {
        income: monthlyTotals.income,
        expenses: monthlyTotals.expenses,
        balance: monthlyTotals.income - monthlyTotals.expenses,
        investments: totalInvestments,
      },
      totalInvestments,
      investmentAllocation,
      recentTransactions,
      categoriesCount: {
        income: incomeCategories.length,
        expense: expenseCategories.length,
      },
    };
  }
}
