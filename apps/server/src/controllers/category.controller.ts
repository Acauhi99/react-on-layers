import { FastifyRequest, FastifyReply } from "fastify";
import { CategoryService } from "../services/category.service.js";
import { z } from "zod";

const createCategorySchema = z.object({
  name: z.string().min(1),
  type: z.enum(["income", "expense"]),
  color: z.string().min(1),
});

const updateCategorySchema = z.object({
  name: z.string().min(1).optional(),
  type: z.enum(["income", "expense"]).optional(),
  color: z.string().min(1).optional(),
});

export class CategoryController {
  private categoryService = new CategoryService();

  async create(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { accountId } = request.params as { accountId: string };
      const body = createCategorySchema.parse(request.body);
      const category = await this.categoryService.createCategory(
        accountId,
        body.name,
        body.type,
        body.color
      );
      reply.status(201).send(category);
    } catch (error) {
      reply.status(400).send({ error: (error as Error).message });
    }
  }

  async getByAccount(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { accountId } = request.params as { accountId: string };
      const { type } = request.query as { type?: "income" | "expense" };

      const categories = type
        ? await this.categoryService.getCategoriesByType(accountId, type)
        : await this.categoryService.getCategoriesByAccount(accountId);

      reply.send(categories);
    } catch (error) {
      reply.status(500).send({ error: (error as Error).message });
    }
  }

  async getById(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string };
      const category = await this.categoryService.getCategoryById(id);

      if (!category) {
        return reply.status(404).send({ error: "Category not found" });
      }

      reply.send(category);
    } catch (error) {
      reply.status(500).send({ error: (error as Error).message });
    }
  }

  async update(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string };
      const body = updateCategorySchema.parse(request.body);
      const category = await this.categoryService.updateCategory(id, body);
      reply.send(category);
    } catch (error) {
      reply.status(400).send({ error: (error as Error).message });
    }
  }

  async delete(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string };
      await this.categoryService.deleteCategory(id);
      reply.status(204).send();
    } catch (error) {
      reply.status(400).send({ error: (error as Error).message });
    }
  }
}
