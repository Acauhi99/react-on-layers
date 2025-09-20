export class Account {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly name: string,
    public readonly password: string,
    public readonly createdAt: Date,
    public readonly modifiedAt: Date
  ) {}

  static create(
    id: string,
    email: string,
    name: string,
    password: string
  ): Account {
    const now = new Date();
    return new Account(id, email, name, password, now, now);
  }

  updateProfile(name?: string, email?: string): Account {
    return new Account(
      this.id,
      email ?? this.email,
      name ?? this.name,
      this.password,
      this.createdAt,
      new Date()
    );
  }
}
