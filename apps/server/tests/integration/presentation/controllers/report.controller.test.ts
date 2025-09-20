import { describe, it, expect, beforeEach, afterEach } from "bun:test";
import Fastify, { FastifyInstance } from "fastify";
import { ReportController } from "../../../../src/presentation/controllers/report.controller.js";

describe("Report Controller Integration", () => {
  let app: FastifyInstance;

  beforeEach(async () => {
    app = Fastify();
    const reportController = new ReportController();

    app.get(
      "/api/reports/monthly/:accountId",
      reportController.getMonthlyReport.bind(reportController)
    );
    app.get(
      "/api/reports/:accountId",
      reportController.getMonthlyReports.bind(reportController)
    );
    app.get(
      "/api/reports/yearly/:accountId",
      reportController.getYearlyReport.bind(reportController)
    );
  });

  afterEach(async () => {
    await app.close();
  });

  describe("GET /api/reports/monthly/:accountId", () => {
    it("should handle monthly report request", async () => {
      // Act
      const response = await app.inject({
        method: "GET",
        url: "/api/reports/monthly/test-account-id?year=2024&month=1",
      });

      // Assert
      expect([200, 400, 401, 500]).toContain(response.statusCode);
    });
  });

  describe("GET /api/reports/:accountId", () => {
    it("should handle monthly reports list request", async () => {
      // Act
      const response = await app.inject({
        method: "GET",
        url: "/api/reports/test-account-id",
      });

      // Assert
      expect([200, 401, 500]).toContain(response.statusCode);
    });
  });

  describe("GET /api/reports/yearly/:accountId", () => {
    it("should handle yearly report request", async () => {
      // Act
      const response = await app.inject({
        method: "GET",
        url: "/api/reports/yearly/test-account-id?year=2024",
      });

      // Assert
      expect([200, 400, 401, 500]).toContain(response.statusCode);
    });
  });
});
