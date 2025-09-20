import {
  CategoryRepository,
  type Category,
} from "../repositories/category.repository.js";
import { AccountRepository } from "../repositories/account.repository.js";
import { generateUUID } from "../utils/uuid.js";

export class CategoryService {
  private categoryRepo = new CategoryRepository();
  private accountRepo = new AccountRepository();

  async createCategory(
    accountId: string,
    name: string,
    type: "income" | "expense",
    color: string
  ): Promise<Category> {
    const account = this.accountRepo.findById(accountId);
    if (!account) {
      throw new Error("Account not found");
    }

    const category = {
      id: generateUUID(),
      account_id: accountId,
      name,
      type,
      color,
    };

    this.categoryRepo.create(category);
    return this.categoryRepo.findById(category.id)!;
  }

  async getCategoriesByAccount(accountId: string): Promise<Category[]> {
    return this.categoryRepo.findByAccountId(accountId);
  }

  async getCategoriesByType(
    accountId: string,
    type: "income" | "expense"
  ): Promise<Category[]> {
    return this.categoryRepo.findByAccountAndType(accountId, type);
  }

  async getCategoryById(id: string): Promise<Category | null> {
    return this.categoryRepo.findById(id) || null;
  }

  async updateCategory(
    id: string,
    data: { name?: string; type?: "income" | "expense"; color?: string }
  ): Promise<Category> {
    const category = this.categoryRepo.findById(id);
    if (!category) {
      throw new Error("Category not found");
    }

    this.categoryRepo.update(id, data);
    return this.categoryRepo.findById(id)!;
  }

  async deleteCategory(id: string): Promise<void> {
    const category = this.categoryRepo.findById(id);
    if (!category) {
      throw new Error("Category not found");
    }

    this.categoryRepo.delete(id);
  }
}
