export class MonthlyBalance {
  constructor(
    public readonly id: string,
    public readonly accountId: string,
    public readonly year: number,
    public readonly month: number,
    public readonly totalIncome: number,
    public readonly totalExpenses: number,
    public readonly netBalance: number,
    public readonly totalInvestments: number,
    public readonly availableToInvest: number,
    public readonly createdAt: Date,
    public readonly modifiedAt: Date
  ) {}

  static create(
    id: string,
    accountId: string,
    year: number,
    month: number,
    totalIncome: number,
    totalExpenses: number,
    totalInvestments: number
  ): MonthlyBalance {
    const now = new Date();
    const netBalance = totalIncome - totalExpenses;
    const availableToInvest = netBalance - totalInvestments;

    return new MonthlyBalance(
      id,
      accountId,
      year,
      month,
      totalIncome,
      totalExpenses,
      netBalance,
      totalInvestments,
      availableToInvest,
      now,
      now
    );
  }
}
