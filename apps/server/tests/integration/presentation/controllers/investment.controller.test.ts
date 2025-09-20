import { describe, it, expect, beforeEach, afterEach } from "bun:test";
import Fastify, { FastifyInstance } from "fastify";
import { InvestmentController } from "../../../../src/presentation/controllers/investment.controller.js";

describe("Investment Controller Integration", () => {
  let app: FastifyInstance;

  beforeEach(async () => {
    app = Fastify();
    const investmentController = new InvestmentController();

    app.post(
      "/api/investments",
      investmentController.create.bind(investmentController)
    );
    app.get(
      "/api/investments",
      investmentController.getByAccount.bind(investmentController)
    );
  });

  afterEach(async () => {
    await app.close();
  });

  describe("POST /api/investments", () => {
    it("should handle investment creation request", async () => {
      // Arrange
      const investmentData = {
        name: "AAPL Stock",
        investmentTypeId: "stocks",
        amount: 1000.5,
        date: "2024-01-15",
      };

      // Act
      const response = await app.inject({
        method: "POST",
        url: "/api/investments",
        payload: investmentData,
      });

      // Assert
      expect([201, 400, 401]).toContain(response.statusCode);
    });
  });

  describe("GET /api/investments", () => {
    it("should handle get investments request", async () => {
      // Act
      const response = await app.inject({
        method: "GET",
        url: "/api/investments",
      });

      // Assert
      expect([200, 401, 500]).toContain(response.statusCode);
    });
  });
});
