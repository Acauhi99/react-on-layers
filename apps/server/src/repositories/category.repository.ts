import { db } from "../database/sqlite.js";

export interface Category {
  id: string;
  account_id: string;
  name: string;
  type: "income" | "expense";
  color: string;
  created_at: string;
  modified_at: string;
}

export class CategoryRepository {
  create(category: Omit<Category, "created_at" | "modified_at">): void {
    db.run(
      `
      INSERT INTO categories (id, account_id, name, type, color)
      VALUES (?, ?, ?, ?, ?)
    `,
      [
        category.id,
        category.account_id,
        category.name,
        category.type,
        category.color,
      ]
    );
  }

  findByAccountId(accountId: string): Category[] {
    return db.all<Category>(
      `
      SELECT * FROM categories WHERE account_id = ?
      ORDER BY name
    `,
      [accountId]
    );
  }

  findByAccountAndType(
    accountId: string,
    type: "income" | "expense"
  ): Category[] {
    return db.all<Category>(
      `
      SELECT * FROM categories
      WHERE account_id = ? AND type = ?
      ORDER BY name
    `,
      [accountId, type]
    );
  }

  findById(id: string): Category | undefined {
    return db.get<Category>(
      `
      SELECT * FROM categories WHERE id = ?
    `,
      [id]
    );
  }

  update(
    id: string,
    data: Partial<Pick<Category, "name" | "type" | "color">>
  ): void {
    const fields = Object.keys(data)
      .map((key) => `${key} = ?`)
      .join(", ");
    const values = Object.values(data);

    db.run(
      `
      UPDATE categories
      SET ${fields}, modified_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `,
      [...values, id]
    );
  }

  delete(id: string): void {
    db.run("DELETE FROM categories WHERE id = ?", [id]);
  }
}
