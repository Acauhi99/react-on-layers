export class Investment {
  constructor(
    public readonly id: string,
    public readonly accountId: string,
    public readonly name: string,
    public readonly investmentTypeId: string,
    public readonly amount: number,
    public readonly date: Date,
    public readonly createdAt: Date,
    public readonly modifiedAt: Date
  ) {}

  static create(
    id: string,
    accountId: string,
    name: string,
    investmentTypeId: string,
    amount: number,
    date: Date
  ): Investment {
    const now = new Date();
    return new Investment(
      id,
      accountId,
      name,
      investmentTypeId,
      amount,
      date,
      now,
      now
    );
  }

  update(
    name?: string,
    investmentTypeId?: string,
    amount?: number,
    date?: Date
  ): Investment {
    return new Investment(
      this.id,
      this.accountId,
      name ?? this.name,
      investmentTypeId ?? this.investmentTypeId,
      amount ?? this.amount,
      date ?? this.date,
      this.createdAt,
      new Date()
    );
  }
}
