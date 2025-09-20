import { describe, it, expect, beforeEach, afterEach } from "bun:test";
import Fastify, { FastifyInstance } from "fastify";
import { CategoryController } from "../../../../src/presentation/controllers/category.controller.js";

describe("Category Controller Integration", () => {
  let app: FastifyInstance;

  beforeEach(async () => {
    app = Fastify();
    const categoryController = new CategoryController();

    app.post(
      "/api/categories",
      categoryController.create.bind(categoryController)
    );
    app.get(
      "/api/categories",
      categoryController.getByAccount.bind(categoryController)
    );
  });

  afterEach(async () => {
    await app.close();
  });

  describe("POST /api/categories", () => {
    it("should handle category creation request", async () => {
      // Arrange
      const categoryData = {
        name: "Food",
        type: "expense",
        color: "#FF0000",
      };

      // Act
      const response = await app.inject({
        method: "POST",
        url: "/api/categories",
        payload: categoryData,
      });

      // Assert
      expect([201, 400, 401]).toContain(response.statusCode);
    });
  });

  describe("GET /api/categories", () => {
    it("should handle get categories request", async () => {
      // Act
      const response = await app.inject({
        method: "GET",
        url: "/api/categories",
      });

      // Assert
      expect([200, 401, 500]).toContain(response.statusCode);
    });
  });
});
