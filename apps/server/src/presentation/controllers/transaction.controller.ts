import { FastifyRequest, FastifyReply } from "fastify";
import { CreateTransactionUseCase } from "../../application/use-cases/create-transaction.use-case.js";
import { GetTransactionsUseCase } from "../../application/use-cases/get-transactions.use-case.js";
import { UpdateTransactionUseCase } from "../../application/use-cases/update-transaction.use-case.js";
import { DeleteTransactionUseCase } from "../../application/use-cases/delete-transaction.use-case.js";
import { TransactionRepositoryImpl } from "../../infrastructure/repositories/transaction.repository.impl.js";
import { AccountRepositoryImpl } from "../../infrastructure/repositories/account.repository.impl.js";
import { CategoryRepositoryImpl } from "../../infrastructure/repositories/category.repository.impl.js";
import { z } from "zod";

const createTransactionSchema = z.object({
  amount: z.number().positive(),
  description: z.string().min(1),
  category_id: z.uuid("v7"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

const updateTransactionSchema = z.object({
  amount: z.number().positive().optional(),
  description: z.string().min(1).optional(),
  category_id: z.uuid("v7").optional(),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
});

export class TransactionController {
  private transactionRepository = new TransactionRepositoryImpl();
  private accountRepository = new AccountRepositoryImpl();
  private categoryRepository = new CategoryRepositoryImpl();

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
      const { limit, year, month, start_date, end_date } = request.query as {
        limit?: string;
        year?: string;
        month?: string;
        start_date?: string;
        end_date?: string;
      };

      const useCase = new GetTransactionsUseCase(this.transactionRepository);
      const transactions = await useCase.execute({
        accountId,
        limit: limit ? parseInt(limit) : undefined,
        year: year ? parseInt(year) : undefined,
        month: month ? parseInt(month) : undefined,
        startDate: start_date ? new Date(start_date) : undefined,
        endDate: end_date ? new Date(end_date) : undefined,
      });

      reply.send(transactions);
    } catch (error) {
      reply.status(500).send({ error: (error as Error).message });
    }
  }

  async getById(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string };
      const transaction = await this.transactionRepository.findById(id);

      if (!transaction) {
        return reply.status(404).send({ error: "Transaction not found" });
      }

      reply.send(transaction);
    } catch (error) {
      reply.status(500).send({ error: (error as Error).message });
    }
  }

  async update(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string };
      const body = updateTransactionSchema.parse(request.body);

      const useCase = new UpdateTransactionUseCase(
        this.transactionRepository,
        this.categoryRepository
      );
      const transaction = await useCase.execute({
        id,
        amount: body.amount,
        description: body.description,
        categoryId: body.category_id,
        date: body.date ? new Date(body.date) : undefined,
      });

      reply.send(transaction);
    } catch (error) {
      reply.status(400).send({ error: (error as Error).message });
    }
  }

  async delete(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string };

      const useCase = new DeleteTransactionUseCase(this.transactionRepository);
      await useCase.execute({ id });

      reply.status(204).send();
    } catch (error) {
      reply.status(400).send({ error: (error as Error).message });
    }
  }
}
