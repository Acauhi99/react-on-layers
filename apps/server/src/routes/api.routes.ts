import { FastifyInstance } from "fastify";
import {
  AccountController,
  CategoryController,
  TransactionController,
  InvestmentController,
  ReportController,
} from "../controllers/index.js";

export async function apiRoutes(fastify: FastifyInstance) {
  const accountController = new AccountController();
  const categoryController = new CategoryController();
  const transactionController = new TransactionController();
  const investmentController = new InvestmentController();
  const reportController = new ReportController();

  // Account routes
  fastify.post("/accounts", accountController.create.bind(accountController));
  fastify.get(
    "/accounts/email/:email",
    accountController.getByEmail.bind(accountController)
  );
  fastify.get(
    "/accounts/:id",
    accountController.getById.bind(accountController)
  );
  fastify.put(
    "/accounts/:id",
    accountController.update.bind(accountController)
  );
  fastify.delete(
    "/accounts/:id",
    accountController.delete.bind(accountController)
  );

  // Category routes
  fastify.post(
    "/accounts/:accountId/categories",
    categoryController.create.bind(categoryController)
  );
  fastify.get(
    "/accounts/:accountId/categories",
    categoryController.getByAccount.bind(categoryController)
  );
  fastify.get(
    "/categories/:id",
    categoryController.getById.bind(categoryController)
  );
  fastify.put(
    "/categories/:id",
    categoryController.update.bind(categoryController)
  );
  fastify.delete(
    "/categories/:id",
    categoryController.delete.bind(categoryController)
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
    "/accounts/:accountId/transactions/totals",
    transactionController.getMonthlyTotals.bind(transactionController)
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
  fastify.get(
    "/investment-types",
    investmentController.getTypes.bind(investmentController)
  );
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
  fastify.get(
    "/investments/:id",
    investmentController.getById.bind(investmentController)
  );
  fastify.put(
    "/investments/:id",
    investmentController.update.bind(investmentController)
  );
  fastify.delete(
    "/investments/:id",
    investmentController.delete.bind(investmentController)
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
  fastify.post(
    "/accounts/:accountId/reports/update-balance",
    reportController.updateMonthlyBalance.bind(reportController)
  );
}
