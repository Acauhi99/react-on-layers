import { Transaction } from "@/domain/entities/transaction.entity";
import { ICategoryRepository } from "@/domain/repositories/category.repository.interface";
import { ITransactionRepository } from "@/domain/repositories/transaction.repository.interface";

export interface UpdateTransactionRequest {
  id: string;
  amount?: number;
  description?: string;
  categoryId?: string;
  date?: Date;
}

export class UpdateTransactionUseCase {
  constructor(
    private transactionRepository: ITransactionRepository,
    private categoryRepository: ICategoryRepository
  ) {}

  async execute(request: UpdateTransactionRequest): Promise<Transaction> {
    const transaction = await this.transactionRepository.findById(request.id);
    if (!transaction) {
      throw new Error("Transaction not found");
    }

    if (request.categoryId) {
      const category = await this.categoryRepository.findById(
        request.categoryId
      );
      if (!category || category.accountId !== transaction.accountId) {
        throw new Error("Category not found or does not belong to account");
      }
    }

    const updatedTransaction = transaction.update(
      request.amount,
      request.description,
      request.categoryId,
      request.date
    );

    await this.transactionRepository.update(updatedTransaction);
    return updatedTransaction;
  }
}
