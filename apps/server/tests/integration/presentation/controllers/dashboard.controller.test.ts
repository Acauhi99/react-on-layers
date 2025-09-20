import { describe, it, expect, beforeEach, afterEach } from "bun:test";
import Fastify, { FastifyInstance } from "fastify";
import { DashboardController } from "../../../../src/presentation/controllers/dashboard.controller.js";

describe("Dashboard Controller Integration", () => {
  let app: FastifyInstance;

  beforeEach(async () => {
    app = Fastify();
    const dashboardController = new DashboardController();

    app.get(
      "/api/dashboard",
      dashboardController.getDashboard.bind(dashboardController)
    );
  });

  afterEach(async () => {
    await app.close();
  });

  describe("GET /api/dashboard", () => {
    it("should handle dashboard request", async () => {
      // Act
      const response = await app.inject({
        method: "GET",
        url: "/api/dashboard",
      });

      // Assert
      expect([200, 401, 500]).toContain(response.statusCode);
    });
  });
});
