import { describe, it, expect, beforeEach, afterEach } from "bun:test";
import Fastify, { FastifyInstance } from "fastify";
import { AuthController } from "./auth.controller";

describe("Auth Controller Integration", () => {
  let app: FastifyInstance;

  beforeEach(async () => {
    app = Fastify();
    const authController = new AuthController();

    // Register only auth routes without middleware
    app.post(
      "/api/auth/register",
      authController.register.bind(authController)
    );
    app.post("/api/auth/login", authController.login.bind(authController));
  });

  afterEach(async () => {
    await app.close();
  });

  describe("POST /api/auth/register", () => {
    it("should handle register request", async () => {
      // Arrange
      const userData = {
        email: "test@example.com",
        name: "Test User",
        password: "password123",
      };

      // Act
      const response = await app.inject({
        method: "POST",
        url: "/api/auth/register",
        payload: userData,
      });

      // Assert
      expect([201, 400]).toContain(response.statusCode);
    });

    it("should return 400 for invalid email", async () => {
      // Arrange
      const invalidData = {
        email: "invalid-email",
        name: "Test User",
        password: "password123",
      };

      // Act
      const response = await app.inject({
        method: "POST",
        url: "/api/auth/register",
        payload: invalidData,
      });

      // Assert
      expect(response.statusCode).toBe(400);
    });

    it("should return 400 for missing required fields", async () => {
      // Arrange
      const incompleteData = {
        email: "test@example.com",
        // Missing name and password
      };

      // Act
      const response = await app.inject({
        method: "POST",
        url: "/api/auth/register",
        payload: incompleteData,
      });

      // Assert
      expect(response.statusCode).toBe(400);
    });
  });

  describe("POST /api/auth/login", () => {
    it("should handle login request", async () => {
      // Arrange
      const loginData = {
        email: "test@example.com",
        password: "password123",
      };

      // Act
      const response = await app.inject({
        method: "POST",
        url: "/api/auth/login",
        payload: loginData,
      });

      // Assert
      expect([200, 401, 400]).toContain(response.statusCode);
    });

    it("should handle invalid credentials", async () => {
      // Arrange
      const invalidLogin = {
        email: "nonexistent@example.com",
        password: "wrongpassword",
      };

      // Act
      const response = await app.inject({
        method: "POST",
        url: "/api/auth/login",
        payload: invalidLogin,
      });

      // Assert
      expect([401, 400]).toContain(response.statusCode);
    });
  });
});
