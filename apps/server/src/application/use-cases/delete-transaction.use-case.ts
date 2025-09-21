import { ITransactionRepository } from "@/domain/repositories/transaction.repository.interface";

export interface DeleteTransactionRequest {
  id: string;
}

export class DeleteTransactionUseCase {
  constructor(private transactionRepository: ITransactionRepository) {}

  async execute(request: DeleteTransactionRequest): Promise<void> {
    const transaction = await this.transactionRepository.findById(request.id);
    if (!transaction) {
      throw new Error("Transaction not found");
    }

    await this.transactionRepository.delete(request.id);
  }
}
