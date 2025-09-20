import { FastifyInstance } from "fastify";
import { AuthController } from "../controllers/auth.controller.js";
import { TransactionController } from "../controllers/transaction.controller.js";
import { CategoryController } from "../controllers/category.controller.js";
import { InvestmentController } from "../controllers/investment.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

export async function apiRoutes(fastify: FastifyInstance) {
  const authController = new AuthController();
  const transactionController = new TransactionController();
  const categoryController = new CategoryController();
  const investmentController = new InvestmentController();

  // Auth routes (public)
  fastify.post("/auth/register", authController.register.bind(authController));
  fastify.post("/auth/login", authController.login.bind(authController));

  // Protected routes
  fastify.addHook("preHandler", authMiddleware);

  // Category routes
  fastify.post(
    "/accounts/:accountId/categories",
    categoryController.create.bind(categoryController)
  );
  fastify.get(
    "/accounts/:accountId/categories",
    categoryController.getByAccount.bind(categoryController)
  );

  // Transaction routes
  fastify.post(
    "/accounts/:accountId/transactions",
    transactionController.create.bind(transactionController)
  );
  fastify.get(
    "/accounts/:accountId/transactions",
    transactionController.getByAccount.bind(transactionController)
  );

  // Investment routes
  fastify.post(
    "/accounts/:accountId/investments",
    investmentController.create.bind(investmentController)
  );
  fastify.get(
    "/accounts/:accountId/investments",
    investmentController.getByAccount.bind(investmentController)
  );
  fastify.get(
    "/accounts/:accountId/investments/summary",
    investmentController.getSummary.bind(investmentController)
  );
}
