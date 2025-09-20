import { ITransactionRepository } from "../../domain/repositories/transaction.repository.interface.js";
import { Transaction } from "../../domain/entities/transaction.entity.js";

export interface GetTransactionsRequest {
  accountId: string;
  limit?: number;
  year?: number;
  month?: number;
}

export class GetTransactionsUseCase {
  constructor(private transactionRepository: ITransactionRepository) {}

  async execute(request: GetTransactionsRequest): Promise<Transaction[]> {
    if (request.year && request.month) {
      return this.transactionRepository.findByAccountAndMonth(
        request.accountId,
        request.year,
        request.month
      );
    }

    return this.transactionRepository.findByAccountId(
      request.accountId,
      request.limit
    );
  }
}
