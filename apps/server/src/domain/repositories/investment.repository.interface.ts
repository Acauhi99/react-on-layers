import { Investment } from "../entities/investment.entity.js";

export interface IInvestmentRepository {
  save(investment: Investment): Promise<void>;
  findById(id: string): Promise<Investment | null>;
  findByAccountId(accountId: string): Promise<Investment[]>;
  findByAccountAndType(
    accountId: string,
    typeId: string
  ): Promise<Investment[]>;
  update(investment: Investment): Promise<void>;
  delete(id: string): Promise<void>;
  getAccountTotal(accountId: string): Promise<number>;
  getAccountAllocation(
    accountId: string
  ): Promise<Array<{ type_name: string; total_amount: number; count: number }>>;
}
