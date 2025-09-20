import {
  InvestmentRepository,
  type Investment,
  type InvestmentType,
  type InvestmentWithType,
} from "../repositories/investment.repository.js";
import { AccountRepository } from "../repositories/account.repository.js";
import { generateUUID } from "../utils/uuid.js";

export class InvestmentService {
  private investmentRepo = new InvestmentRepository();
  private accountRepo = new AccountRepository();

  async getInvestmentTypes(): Promise<InvestmentType[]> {
    return this.investmentRepo.getAllTypes();
  }

  async createInvestment(
    accountId: string,
    name: string,
    investmentTypeId: string,
    amount: number,
    date: string
  ): Promise<Investment> {
    const account = this.accountRepo.findById(accountId);
    if (!account) {
      throw new Error("Account not found");
    }

    const types = this.investmentRepo.getAllTypes();
    const typeExists = types.some((type) => type.id === investmentTypeId);
    if (!typeExists) {
      throw new Error("Investment type not found");
    }

    const investment = {
      id: generateUUID(),
      account_id: accountId,
      name,
      investment_type_id: investmentTypeId,
      amount,
      date,
    };

    this.investmentRepo.create(investment);
    return this.investmentRepo.findById(investment.id)!;
  }

  async getInvestmentsByAccount(
    accountId: string
  ): Promise<InvestmentWithType[]> {
    return this.investmentRepo.findByAccountId(accountId);
  }

  async getInvestmentsByType(
    accountId: string,
    typeId: string
  ): Promise<Investment[]> {
    return this.investmentRepo.findByAccountAndType(accountId, typeId);
  }

  async getInvestmentById(id: string): Promise<Investment | null> {
    return this.investmentRepo.findById(id) || null;
  }

  async updateInvestment(
    id: string,
    data: {
      name?: string;
      investment_type_id?: string;
      amount?: number;
      date?: string;
    }
  ): Promise<Investment> {
    const investment = this.investmentRepo.findById(id);
    if (!investment) {
      throw new Error("Investment not found");
    }

    if (data.investment_type_id) {
      const types = this.investmentRepo.getAllTypes();
      const typeExists = types.some(
        (type) => type.id === data.investment_type_id
      );
      if (!typeExists) {
        throw new Error("Investment type not found");
      }
    }

    this.investmentRepo.update(id, data);
    return this.investmentRepo.findById(id)!;
  }

  async deleteInvestment(id: string): Promise<void> {
    const investment = this.investmentRepo.findById(id);
    if (!investment) {
      throw new Error("Investment not found");
    }

    this.investmentRepo.delete(id);
  }

  async getAccountInvestmentSummary(accountId: string): Promise<{
    total: number;
    allocation: Array<{
      type_name: string;
      total_amount: number;
      count: number;
      percentage: number;
    }>;
  }> {
    const total = this.investmentRepo.getAccountTotal(accountId);
    const allocation = this.investmentRepo.getAccountAllocation(accountId);

    const allocationWithPercentage = allocation.map((item) => ({
      ...item,
      percentage: total > 0 ? (item.total_amount / total) * 100 : 0,
    }));

    return {
      total,
      allocation: allocationWithPercentage,
    };
  }

  async getMonthlyInvestmentTotal(
    accountId: string,
    year: number,
    month: number
  ): Promise<number> {
    return this.investmentRepo.getMonthlyTotal(accountId, year, month);
  }
}
