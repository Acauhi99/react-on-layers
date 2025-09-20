import { db } from "../database/sqlite.js";

export interface Account {
  id: string;
  email: string;
  name: string;
  created_at: string;
  modified_at: string;
}

export class AccountRepository {
  create(account: Omit<Account, "created_at" | "modified_at">): void {
    db.run(
      `
      INSERT INTO accounts (id, email, name)
      VALUES (?, ?, ?)
    `,
      [account.id, account.email, account.name]
    );
  }

  findByEmail(email: string): Account | undefined {
    return db.get<Account>(
      `
      SELECT * FROM accounts WHERE email = ?
    `,
      [email]
    );
  }

  findById(id: string): Account | undefined {
    return db.get<Account>(
      `
      SELECT * FROM accounts WHERE id = ?
    `,
      [id]
    );
  }

  update(id: string, data: Partial<Pick<Account, "email" | "name">>): void {
    const fields = Object.keys(data)
      .map((key) => `${key} = ?`)
      .join(", ");
    const values = Object.values(data);

    db.run(
      `
      UPDATE accounts
      SET ${fields}, modified_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `,
      [...values, id]
    );
  }

  delete(id: string): void {
    db.run("DELETE FROM accounts WHERE id = ?", [id]);
  }
}
