import { FastifyRequest, FastifyReply } from "fastify";
import { CreateTransactionUseCase } from "../../application/use-cases/create-transaction.use-case.js";
import { GetTransactionsUseCase } from "../../application/use-cases/get-transactions.use-case.js";
import { TransactionRepositoryImpl } from "../../infrastructure/repositories/transaction.repository.impl.js";
import { AccountRepositoryImpl } from "../../infrastructure/repositories/account.repository.impl.js";
import { z } from "zod";

const createTransactionSchema = z.object({
  amount: z.number().positive(),
  description: z.string().min(1),
  category_id: z.uuid("v7"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export class TransactionController {
  private transactionRepository = new TransactionRepositoryImpl();
  private accountRepository = new AccountRepositoryImpl();

  async create(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { accountId } = request.params as { accountId: string };
      const body = createTransactionSchema.parse(request.body);

      const useCase = new CreateTransactionUseCase(
        this.transactionRepository,
        this.accountRepository
      );
      const transaction = await useCase.execute({
        accountId,
        amount: body.amount,
        description: body.description,
        categoryId: body.category_id,
        date: new Date(body.date),
      });

      reply.status(201).send(transaction);
    } catch (error) {
      reply.status(400).send({ error: (error as Error).message });
    }
  }

  async getByAccount(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { accountId } = request.params as { accountId: string };
      const { limit, year, month } = request.query as {
        limit?: string;
        year?: string;
        month?: string;
      };

      const useCase = new GetTransactionsUseCase(this.transactionRepository);
      const transactions = await useCase.execute({
        accountId,
        limit: limit ? parseInt(limit) : undefined,
        year: year ? parseInt(year) : undefined,
        month: month ? parseInt(month) : undefined,
      });

      reply.send(transactions);
    } catch (error) {
      reply.status(500).send({ error: (error as Error).message });
    }
  }
}
