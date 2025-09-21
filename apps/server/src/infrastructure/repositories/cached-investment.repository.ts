import { IInvestmentRepository } from "@/domain/repositories/investment.repository.interface.js";
import { cache } from "../cache/memory-cache.js";
import { InvestmentRepositoryImpl } from "./investment.repository.impl.js";
import { Investment } from "@/domain/entities/investment.entity.js";

export class CachedInvestmentRepository implements IInvestmentRepository {
  private repository = new InvestmentRepositoryImpl();
  private cacheTTL = 15 * 60 * 1000; // 15 minutes

  async save(investment: Investment): Promise<void> {
    await this.repository.save(investment);
    cache.invalidatePattern(`investments:${investment.accountId}`);
  }

  async findById(id: string): Promise<Investment | null> {
    return this.repository.findById(id);
  }

  async findByAccountId(accountId: string): Promise<Investment[]> {
    const cacheKey = `investments:${accountId}`;
    let investments = cache.get<Investment[]>(cacheKey);

    if (!investments) {
      investments = await this.repository.findByAccountId(accountId);
      cache.set(cacheKey, investments, this.cacheTTL);
    }

    return investments;
  }

  async findByAccountAndType(
    accountId: string,
    typeId: string
  ): Promise<Investment[]> {
    return this.repository.findByAccountAndType(accountId, typeId);
  }

  async update(investment: Investment): Promise<void> {
    await this.repository.update(investment);
    cache.invalidatePattern(`investments:${investment.accountId}`);
  }

  async delete(id: string): Promise<void> {
    const investment = await this.findById(id);
    await this.repository.delete(id);

    if (investment) {
      cache.invalidatePattern(`investments:${investment.accountId}`);
    }
  }

  async getAccountTotal(accountId: string): Promise<number> {
    const cacheKey = `investment-total:${accountId}`;
    let total = cache.get<number>(cacheKey);

    if (total === null) {
      total = await this.repository.getAccountTotal(accountId);
      cache.set(cacheKey, total, this.cacheTTL);
    }

    return total;
  }

  async getAccountAllocation(
    accountId: string
  ): Promise<
    Array<{ type_name: string; total_amount: number; count: number }>
  > {
    const cacheKey = `investment-allocation:${accountId}`;
    let allocation =
      cache.get<
        Array<{ type_name: string; total_amount: number; count: number }>
      >(cacheKey);

    if (!allocation) {
      allocation = await this.repository.getAccountAllocation(accountId);
      cache.set(cacheKey, allocation, this.cacheTTL);
    }

    return allocation;
  }
}
