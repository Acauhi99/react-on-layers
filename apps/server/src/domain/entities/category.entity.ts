export type CategoryType = "income" | "expense";

export class Category {
  constructor(
    public readonly id: string,
    public readonly accountId: string,
    public readonly name: string,
    public readonly type: CategoryType,
    public readonly color: string,
    public readonly createdAt: Date,
    public readonly modifiedAt: Date
  ) {}

  static create(
    id: string,
    accountId: string,
    name: string,
    type: CategoryType,
    color: string
  ): Category {
    const now = new Date();
    return new Category(id, accountId, name, type, color, now, now);
  }

  update(name?: string, type?: CategoryType, color?: string): Category {
    return new Category(
      this.id,
      this.accountId,
      name ?? this.name,
      type ?? this.type,
      color ?? this.color,
      this.createdAt,
      new Date()
    );
  }
}
