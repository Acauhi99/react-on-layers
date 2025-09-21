import { IInvestmentRepository } from "@/domain/repositories/investment.repository.interface.js";
import { db } from "../database/sqlite.js";
import { Investment } from "@/domain/entities/investment.entity.js";

interface InvestmentData {
  id: string;
  account_id: string;
  name: string;
  investment_type_id: string;
  amount: number;
  date: string;
  created_at: string;
  modified_at: string;
}

export class InvestmentRepositoryImpl implements IInvestmentRepository {
  async save(investment: Investment): Promise<void> {
    db.run(
      `
      INSERT INTO investments (id, account_id, name, investment_type_id, amount, date, created_at, modified_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `,
      [
        investment.id,
        investment.accountId,
        investment.name,
        investment.investmentTypeId,
        investment.amount,
        investment.date.toISOString().split("T")[0],
        investment.createdAt.toISOString(),
        investment.modifiedAt.toISOString(),
      ]
    );
  }

  async findById(id: string): Promise<Investment | null> {
    const data = db.get<InvestmentData>(
      `SELECT * FROM investments WHERE id = ?`,
      [id]
    );
    return data ? this.toDomain(data) : null;
  }

  async findByAccountId(accountId: string): Promise<Investment[]> {
    const data = db.all<InvestmentData>(
      `
      SELECT * FROM investments WHERE account_id = ? ORDER BY date DESC
    `,
      [accountId]
    );
    return data.map((item) => this.toDomain(item));
  }

  async findByAccountAndType(
    accountId: string,
    typeId: string
  ): Promise<Investment[]> {
    const data = db.all<InvestmentData>(
      `
      SELECT * FROM investments WHERE account_id = ? AND investment_type_id = ? ORDER BY date DESC
    `,
      [accountId, typeId]
    );
    return data.map((item) => this.toDomain(item));
  }

  async update(investment: Investment): Promise<void> {
    db.run(
      `
      UPDATE investments
      SET name = ?, investment_type_id = ?, amount = ?, date = ?, modified_at = ?
      WHERE id = ?
    `,
      [
        investment.name,
        investment.investmentTypeId,
        investment.amount,
        investment.date.toISOString().split("T")[0],
        investment.modifiedAt.toISOString(),
        investment.id,
      ]
    );
  }

  async delete(id: string): Promise<void> {
    db.run("DELETE FROM investments WHERE id = ?", [id]);
  }

  async getAccountTotal(accountId: string): Promise<number> {
    const result = db.get<{ total: number }>(
      `
      SELECT COALESCE(SUM(amount), 0) as total FROM investments WHERE account_id = ?
    `,
      [accountId]
    );
    return result?.total || 0;
  }

  async getAccountAllocation(
    accountId: string
  ): Promise<
    Array<{ type_name: string; total_amount: number; count: number }>
  > {
    return db.all<{ type_name: string; total_amount: number; count: number }>(
      `
      SELECT
        it.name as type_name,
        SUM(i.amount) as total_amount,
        COUNT(i.id) as count
      FROM investments i
      JOIN investment_types it ON i.investment_type_id = it.id
      WHERE i.account_id = ?
      GROUP BY it.id, it.name
      ORDER BY total_amount DESC
    `,
      [accountId]
    );
  }

  private toDomain(data: InvestmentData): Investment {
    return new Investment(
      data.id,
      data.account_id,
      data.name,
      data.investment_type_id,
      data.amount,
      new Date(data.date),
      new Date(data.created_at),
      new Date(data.modified_at)
    );
  }
}
