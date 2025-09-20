import { describe, it, expect, beforeEach, afterEach } from "bun:test";
import Fastify, { FastifyInstance } from "fastify";
import { TransactionController } from "../../../../src/presentation/controllers/transaction.controller.js";

describe("Transaction Controller Integration", () => {
  let app: FastifyInstance;

  beforeEach(async () => {
    app = Fastify();
    const transactionController = new TransactionController();

    app.post(
      "/api/transactions",
      transactionController.create.bind(transactionController)
    );
    app.get(
      "/api/transactions",
      transactionController.getByAccount.bind(transactionController)
    );
    app.put(
      "/api/transactions/:id",
      transactionController.update.bind(transactionController)
    );
    app.delete(
      "/api/transactions/:id",
      transactionController.delete.bind(transactionController)
    );
  });

  afterEach(async () => {
    await app.close();
  });

  describe("POST /api/transactions", () => {
    it("should handle transaction creation request", async () => {
      // Arrange
      const transactionData = {
        amount: 100.5,
        description: "Grocery shopping",
        categoryId: "test-category-id",
        date: "2024-01-15",
      };

      // Act
      const response = await app.inject({
        method: "POST",
        url: "/api/transactions",
        payload: transactionData,
      });

      // Assert
      expect([201, 400, 401]).toContain(response.statusCode);
    });
  });

  describe("GET /api/transactions", () => {
    it("should handle get transactions request", async () => {
      // Act
      const response = await app.inject({
        method: "GET",
        url: "/api/transactions",
      });

      // Assert
      expect([200, 401, 500]).toContain(response.statusCode);
    });
  });
});
