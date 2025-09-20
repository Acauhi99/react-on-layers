import { Category } from "../entities/category.entity.js";

export interface ICategoryRepository {
  save(category: Category): Promise<void>;
  findById(id: string): Promise<Category | null>;
  findByAccountId(accountId: string): Promise<Category[]>;
  findByAccountAndType(
    accountId: string,
    type: "income" | "expense"
  ): Promise<Category[]>;
  update(category: Category): Promise<void>;
  delete(id: string): Promise<void>;
}
