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
  fastify.get(
    "/transactions/:id",
    transactionController.getById.bind(transactionController)
  );
  fastify.put(
    "/transactions/:id",
    transactionController.update.bind(transactionController)
  );
  fastify.delete(
    "/transactions/:id",
    transactionController.delete.bind(transactionController)
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

  // Report routes
  fastify.get(
    "/accounts/:accountId/reports/monthly",
    reportController.getMonthlyReport.bind(reportController)
  );
  fastify.get(
    "/accounts/:accountId/reports/monthly/list",
    reportController.getMonthlyReports.bind(reportController)
  );
  fastify.get(
    "/accounts/:accountId/reports/yearly",
    reportController.getYearlyReport.bind(reportController)
  );

  // Dashboard routes
  fastify.get(
    "/accounts/:accountId/dashboard",
    dashboardController.getDashboard.bind(dashboardController)
  );
}
