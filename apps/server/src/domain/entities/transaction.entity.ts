export class Transaction {
  constructor(
    public readonly id: string,
    public readonly accountId: string,
    public readonly amount: number,
    public readonly description: string,
    public readonly categoryId: string,
    public readonly date: Date,
    public readonly createdAt: Date,
    public readonly modifiedAt: Date
  ) {}

  static create(
    id: string,
    accountId: string,
    amount: number,
    description: string,
    categoryId: string,
    date: Date
  ): Transaction {
    const now = new Date();
    return new Transaction(
      id,
      accountId,
      amount,
      description,
      categoryId,
      date,
      now,
      now
    );
  }

  update(
    amount?: number,
    description?: string,
    categoryId?: string,
    date?: Date
  ): Transaction {
    return new Transaction(
      this.id,
      this.accountId,
      amount ?? this.amount,
      description ?? this.description,
      categoryId ?? this.categoryId,
      date ?? this.date,
      this.createdAt,
      new Date()
    );
  }
}
