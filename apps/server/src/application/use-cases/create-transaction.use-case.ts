import { ITransactionRepository } from "../../domain/repositories/transaction.repository.interface.js";
import { IAccountRepository } from "../../domain/repositories/account.repository.interface.js";
import { Transaction } from "../../domain/entities/transaction.entity.js";
import { generateUUID } from "../../utils/uuid.js";

export interface CreateTransactionRequest {
  accountId: string;
  amount: number;
  description: string;
  categoryId: string;
  date: Date;
}

export class CreateTransactionUseCase {
  constructor(
    private transactionRepository: ITransactionRepository,
    private accountRepository: IAccountRepository
  ) {}

  async execute(request: CreateTransactionRequest): Promise<Transaction> {
    const account = await this.accountRepository.findById(request.accountId);
    if (!account) {
      throw new Error("Account not found");
    }

    const transaction = Transaction.create(
      generateUUID(),
      request.accountId,
      request.amount,
      request.description,
      request.categoryId,
      request.date
    );

    await this.transactionRepository.save(transaction);
    return transaction;
  }
}
