import { ICategoryRepository } from "../../domain/repositories/category.repository.interface.js";
import { IAccountRepository } from "../../domain/repositories/account.repository.interface.js";
import {
  Category,
  CategoryType,
} from "../../domain/entities/category.entity.js";
import { generateUUID } from "../../utils/uuid.js";

export interface CreateCategoryRequest {
  accountId: string;
  name: string;
  type: CategoryType;
  color: string;
}

export class CreateCategoryUseCase {
  constructor(
    private categoryRepository: ICategoryRepository,
    private accountRepository: IAccountRepository
  ) {}

  async execute(request: CreateCategoryRequest): Promise<Category> {
    const account = await this.accountRepository.findById(request.accountId);
    if (!account) {
      throw new Error("Account not found");
    }

    const category = Category.create(
      generateUUID(),
      request.accountId,
      request.name,
      request.type,
      request.color
    );

    await this.categoryRepository.save(category);
    return category;
  }
}
