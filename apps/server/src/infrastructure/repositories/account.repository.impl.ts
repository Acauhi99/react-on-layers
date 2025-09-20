import { IAccountRepository } from "../../domain/repositories/account.repository.interface.js";
import { Account } from "../../domain/entities/account.entity.js";
import { db } from "../database/sqlite.js";

interface AccountData {
  id: string;
  email: string;
  name: string;
  password: string;
  created_at: string;
  modified_at: string;
}

export class AccountRepositoryImpl implements IAccountRepository {
  async save(account: Account): Promise<void> {
    db.run(
      `
      INSERT INTO accounts (id, email, name, password, created_at, modified_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `,
      [
        account.id,
        account.email,
        account.name,
        account.password,
        account.createdAt.toISOString(),
        account.modifiedAt.toISOString(),
      ]
    );
  }

  async findById(id: string): Promise<Account | null> {
    const data = db.get<AccountData>(
      `
      SELECT * FROM accounts WHERE id = ?
    `,
      [id]
    );

    return data ? this.toDomain(data) : null;
  }

  async findByEmail(email: string): Promise<Account | null> {
    const data = db.get<AccountData>(
      `
      SELECT * FROM accounts WHERE email = ?
    `,
      [email]
    );

    return data ? this.toDomain(data) : null;
  }

  async update(account: Account): Promise<void> {
    db.run(
      `
      UPDATE accounts
      SET email = ?, name = ?, password = ?, modified_at = ?
      WHERE id = ?
    `,
      [
        account.email,
        account.name,
        account.password,
        account.modifiedAt.toISOString(),
        account.id,
      ]
    );
  }

  async delete(id: string): Promise<void> {
    db.run("DELETE FROM accounts WHERE id = ?", [id]);
  }

  private toDomain(data: AccountData): Account {
    return new Account(
      data.id,
      data.email,
      data.name,
      data.password,
      new Date(data.created_at),
      new Date(data.modified_at)
    );
  }
}
