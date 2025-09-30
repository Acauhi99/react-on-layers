import { FastifyInstance } from "fastify";
import { AuthController } from "../controllers/auth.controller";
import { TransactionController } from "../controllers/transaction.controller";
import { CategoryController } from "../controllers/category.controller";
import { InvestmentController } from "../controllers/investment.controller";
import { ReportController } from "../controllers/report.controller";
import { DashboardController } from "../controllers/dashboard.controller";
import { authMiddleware } from "../middleware/auth.middleware";

export async function apiRoutes(fastify: FastifyInstance) {
  const authController = new AuthController();
  const transactionController = new TransactionController();
  const categoryController = new CategoryController();
  const investmentController = new InvestmentController();
  const reportController = new ReportController();
  const dashboardController = new DashboardController();

  // Auth routes (public)
  fastify.post("/auth", (req, reply) => void authController.auth(req, reply));
  fastify.post(
    "/auth/register",
    (req, reply) => void authController.register(req, reply)
  );
  fastify.post(
    "/auth/login",
    (req, reply) => void authController.login(req, reply)
  );

  // Category routes (protected)
  fastify.post(
    "/accounts/:accountId/categories",
    { preHandler: (req, reply) => void authMiddleware(req, reply) },
    (req, reply) => void categoryController.create(req, reply)
  );
  fastify.get(
    "/accounts/:accountId/categories",
    { preHandler: (req, reply) => void authMiddleware(req, reply) },
    (req, reply) => void categoryController.getByAccount(req, reply)
  );

  // Transaction routes (protected)
  fastify.post(
    "/accounts/:accountId/transactions",
    { preHandler: (req, reply) => void authMiddleware(req, reply) },
    (req, reply) => void transactionController.create(req, reply)
  );
  fastify.get(
    "/accounts/:accountId/transactions",
    { preHandler: (req, reply) => void authMiddleware(req, reply) },
    (req, reply) => void transactionController.getByAccount(req, reply)
  );
  fastify.get(
    "/transactions/:id",
    { preHandler: (req, reply) => void authMiddleware(req, reply) },
    (req, reply) => void transactionController.getById(req, reply)
  );
  fastify.put(
    "/transactions/:id",
    { preHandler: (req, reply) => void authMiddleware(req, reply) },
    (req, reply) => void transactionController.update(req, reply)
  );
  fastify.delete(
    "/transactions/:id",
    { preHandler: (req, reply) => void authMiddleware(req, reply) },
    (req, reply) => void transactionController.delete(req, reply)
  );

  // Investment routes (protected)
  fastify.post(
    "/accounts/:accountId/investments",
    { preHandler: (req, reply) => void authMiddleware(req, reply) },
    (req, reply) => void investmentController.create(req, reply)
  );
  fastify.get(
    "/accounts/:accountId/investments",
    { preHandler: (req, reply) => void authMiddleware(req, reply) },
    (req, reply) => void investmentController.getByAccount(req, reply)
  );
  fastify.get(
    "/accounts/:accountId/investments/summary",
    { preHandler: (req, reply) => void authMiddleware(req, reply) },
    (req, reply) => void investmentController.getSummary(req, reply)
  );

  // Report routes (protected)
  fastify.get(
    "/accounts/:accountId/reports/monthly",
    { preHandler: (req, reply) => void authMiddleware(req, reply) },
    (req, reply) => void reportController.getMonthlyReport(req, reply)
  );
  fastify.get(
    "/accounts/:accountId/reports/monthly/list",
    { preHandler: (req, reply) => void authMiddleware(req, reply) },
    (req, reply) => void reportController.getMonthlyReports(req, reply)
  );
  fastify.get(
    "/accounts/:accountId/reports/yearly",
    { preHandler: (req, reply) => void authMiddleware(req, reply) },
    (req, reply) => void reportController.getYearlyReport(req, reply)
  );

  // Dashboard routes (protected)
  fastify.get(
    "/accounts/:accountId/dashboard",
    { preHandler: (req, reply) => void authMiddleware(req, reply) },
    (req, reply) => void dashboardController.getDashboard(req, reply)
  );
}
