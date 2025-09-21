import { Transaction } from "@/domain/entities/transaction.entity";
import { ITransactionRepository } from "@/domain/repositories/transaction.repository.interface";

export interface GetTransactionsRequest {
  accountId: string;
  limit?: number;
  year?: number;
  month?: number;
  startDate?: Date;
  endDate?: Date;
}

export class GetTransactionsUseCase {
  constructor(private transactionRepository: ITransactionRepository) {}

  async execute(request: GetTransactionsRequest): Promise<Transaction[]> {
    if (request.startDate && request.endDate) {
      return this.transactionRepository.findByAccountAndDateRange(
        request.accountId,
        request.startDate,
        request.endDate
      );
    }

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
