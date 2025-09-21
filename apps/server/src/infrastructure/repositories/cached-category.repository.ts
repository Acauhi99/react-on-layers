import { ICategoryRepository } from "@/domain/repositories/category.repository.interface.js";
import { cache } from "../cache/memory-cache.js";
import { CategoryRepositoryImpl } from "./category.repository.impl.js";
import { Category, CategoryType } from "@/domain/entities/category.entity.js";

export class CachedCategoryRepository implements ICategoryRepository {
  private repository = new CategoryRepositoryImpl();
  private cacheTTL = 10 * 60 * 1000; // 10 minutes

  async save(category: Category): Promise<void> {
    await this.repository.save(category);
    cache.invalidatePattern(`categories:${category.accountId}`);
  }

  async findById(id: string): Promise<Category | null> {
    const cacheKey = `category:${id}`;
    let category = cache.get<Category>(cacheKey);

    if (!category) {
      category = await this.repository.findById(id);
      if (category) {
        cache.set(cacheKey, category, this.cacheTTL);
      }
    }

    return category;
  }

  async findByAccountId(accountId: string): Promise<Category[]> {
    const cacheKey = `categories:${accountId}`;
    let categories = cache.get<Category[]>(cacheKey);

    if (!categories) {
      categories = await this.repository.findByAccountId(accountId);
      cache.set(cacheKey, categories, this.cacheTTL);
    }

    return categories;
  }

  async findByAccountAndType(
    accountId: string,
    type: CategoryType
  ): Promise<Category[]> {
    const cacheKey = `categories:${accountId}:${type}`;
    let categories = cache.get<Category[]>(cacheKey);

    if (!categories) {
      categories = await this.repository.findByAccountAndType(accountId, type);
      cache.set(cacheKey, categories, this.cacheTTL);
    }

    return categories;
  }

  async update(category: Category): Promise<void> {
    await this.repository.update(category);
    cache.delete(`category:${category.id}`);
    cache.invalidatePattern(`categories:${category.accountId}`);
  }

  async delete(id: string): Promise<void> {
    const category = await this.findById(id);
    await this.repository.delete(id);

    if (category) {
      cache.delete(`category:${id}`);
      cache.invalidatePattern(`categories:${category.accountId}`);
    }
  }
}
