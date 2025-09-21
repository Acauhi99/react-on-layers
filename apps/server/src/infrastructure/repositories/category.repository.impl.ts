import { Category, CategoryType } from "@/domain/entities/category.entity.js";
import { db } from "../database/sqlite.js";
import { ICategoryRepository } from "@/domain/repositories/category.repository.interface.js";

interface CategoryData {
  id: string;
  account_id: string;
  name: string;
  type: CategoryType;
  color: string;
  created_at: string;
  modified_at: string;
}

export class CategoryRepositoryImpl implements ICategoryRepository {
  async save(category: Category): Promise<void> {
    db.run(
      `
      INSERT INTO categories (id, account_id, name, type, color, created_at, modified_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
      [
        category.id,
        category.accountId,
        category.name,
        category.type,
        category.color,
        category.createdAt.toISOString(),
        category.modifiedAt.toISOString(),
      ]
    );
  }

  async findById(id: string): Promise<Category | null> {
    const data = db.get<CategoryData>(`SELECT * FROM categories WHERE id = ?`, [
      id,
    ]);
    return data ? this.toDomain(data) : null;
  }

  async findByAccountId(accountId: string): Promise<Category[]> {
    const data = db.all<CategoryData>(
      `
      SELECT * FROM categories WHERE account_id = ? ORDER BY name
    `,
      [accountId]
    );
    return data.map((item) => this.toDomain(item));
  }

  async findByAccountAndType(
    accountId: string,
    type: "income" | "expense"
  ): Promise<Category[]> {
    const data = db.all<CategoryData>(
      `
      SELECT * FROM categories WHERE account_id = ? AND type = ? ORDER BY name
    `,
      [accountId, type]
    );
    return data.map((item) => this.toDomain(item));
  }

  async update(category: Category): Promise<void> {
    db.run(
      `
      UPDATE categories SET name = ?, type = ?, color = ?, modified_at = ? WHERE id = ?
    `,
      [
        category.name,
        category.type,
        category.color,
        category.modifiedAt.toISOString(),
        category.id,
      ]
    );
  }

  async delete(id: string): Promise<void> {
    db.run("DELETE FROM categories WHERE id = ?", [id]);
  }

  private toDomain(data: CategoryData): Category {
    return new Category(
      data.id,
      data.account_id,
      data.name,
      data.type,
      data.color,
      new Date(data.created_at),
      new Date(data.modified_at)
    );
  }
}
