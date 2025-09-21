import { CreateCategoryUseCase } from "@/application/use-cases/create-category.use-case";
import { GetCategoriesUseCase } from "@/application/use-cases/get-categories.use-case";
import { AccountRepositoryImpl } from "@/infrastructure/repositories/account.repository.impl";
import { CachedCategoryRepository } from "@/infrastructure/repositories/cached-category.repository";
import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";

const createCategorySchema = z.object({
  name: z.string().min(1),
  type: z.enum(["income", "expense"]),
  color: z.string().min(1),
});

export class CategoryController {
  private categoryRepository = new CachedCategoryRepository();
  private accountRepository = new AccountRepositoryImpl();

  async create(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { accountId } = request.params as { accountId: string };
      const body = createCategorySchema.parse(request.body);

      const useCase = new CreateCategoryUseCase(
        this.categoryRepository,
        this.accountRepository
      );
      const category = await useCase.execute({
        accountId,
        name: body.name,
        type: body.type,
        color: body.color,
      });

      reply.status(201).send(category);
    } catch (error) {
      reply.status(400).send({ error: (error as Error).message });
    }
  }

  async getByAccount(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { accountId } = request.params as { accountId: string };
      const { type } = request.query as { type?: "income" | "expense" };

      const useCase = new GetCategoriesUseCase(this.categoryRepository);
      const categories = await useCase.execute({ accountId, type });

      reply.send(categories);
    } catch (error) {
      reply.status(500).send({ error: (error as Error).message });
    }
  }
}
