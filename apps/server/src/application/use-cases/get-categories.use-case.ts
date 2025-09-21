import { Category, CategoryType } from "@/domain/entities/category.entity";
import { ICategoryRepository } from "@/domain/repositories/category.repository.interface";

export interface GetCategoriesRequest {
  accountId: string;
  type?: CategoryType;
}

export class GetCategoriesUseCase {
  constructor(private categoryRepository: ICategoryRepository) {}

  async execute(request: GetCategoriesRequest): Promise<Category[]> {
    if (request.type) {
      return this.categoryRepository.findByAccountAndType(
        request.accountId,
        request.type
      );
    }
    return this.categoryRepository.findByAccountId(request.accountId);
  }
}
