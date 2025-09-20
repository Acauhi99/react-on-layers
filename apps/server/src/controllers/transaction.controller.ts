import { FastifyRequest, FastifyReply } from "fastify";
import { TransactionService } from "../services/transaction.service.js";
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
  private transactionService = new TransactionService();

  async create(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { accountId } = request.params as { accountId: string };
      const body = createTransactionSchema.parse(request.body);
      const transaction = await this.transactionService.createTransaction(
        accountId,
        body.amount,
        body.description,
        body.category_id,
        body.date
      );
      reply.status(201).send(transaction);
    } catch (error) {
      reply.status(400).send({ error: (error as Error).message });
    }
  }

  async getByAccount(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { accountId } = request.params as { accountId: string };
      const { limit, start_date, end_date, year, month } = request.query as {
        limit?: string;
        start_date?: string;
        end_date?: string;
        year?: string;
        month?: string;
      };

      let transactions;

      if (year && month) {
        transactions = await this.transactionService.getTransactionsByMonth(
          accountId,
          parseInt(year),
          parseInt(month)
        );
      } else if (start_date && end_date) {
        transactions = await this.transactionService.getTransactionsByDateRange(
          accountId,
          start_date,
          end_date
        );
      } else {
        transactions = await this.transactionService.getTransactionsByAccount(
          accountId,
          limit ? parseInt(limit) : undefined
        );
      }

      reply.send(transactions);
    } catch (error) {
      reply.status(500).send({ error: (error as Error).message });
    }
  }

  async getById(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string };
      const transaction = await this.transactionService.getTransactionById(id);

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
      const transaction = await this.transactionService.updateTransaction(
        id,
        body
      );
      reply.send(transaction);
    } catch (error) {
      reply.status(400).send({ error: (error as Error).message });
    }
  }

  async delete(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string };
      await this.transactionService.deleteTransaction(id);
      reply.status(204).send();
    } catch (error) {
      reply.status(400).send({ error: (error as Error).message });
    }
  }

  async getMonthlyTotals(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { accountId } = request.params as { accountId: string };
      const { year, month } = request.query as { year: string; month: string };

      const totals = await this.transactionService.getMonthlyTotals(
        accountId,
        parseInt(year),
        parseInt(month)
      );

      reply.send(totals);
    } catch (error) {
      reply.status(500).send({ error: (error as Error).message });
    }
  }
}
