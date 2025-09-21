import { describe, it, expect } from "bun:test";
import { AuthDomainService } from "./auth.domain-service";

describe("AuthDomainService", () => {
  describe("hashPassword", () => {
    it("should hash password successfully", async () => {
      // Arrange
      const password = "testPassword123";

      // Act
      const hashedPassword = await AuthDomainService.hashPassword(password);

      // Assert
      expect(hashedPassword).toBeDefined();
      expect(hashedPassword).not.toBe(password);
      expect(hashedPassword.length).toBeGreaterThan(50);
    });
  });

  describe("verifyPassword", () => {
    it("should verify correct password", async () => {
      // Arrange
      const password = "testPassword123";
      const hashedPassword = await AuthDomainService.hashPassword(password);

      // Act
      const isValid = await AuthDomainService.verifyPassword(
        password,
        hashedPassword
      );

      // Assert
      expect(isValid).toBe(true);
    });

    it("should reject incorrect password", async () => {
      // Arrange
      const password = "testPassword123";
      const wrongPassword = "wrongPassword";
      const hashedPassword = await AuthDomainService.hashPassword(password);

      // Act
      const isValid = await AuthDomainService.verifyPassword(
        wrongPassword,
        hashedPassword
      );

      // Assert
      expect(isValid).toBe(false);
    });
  });

  describe("generateToken", () => {
    it("should generate valid JWT token", () => {
      // Arrange
      const accountId = "test-account-id";

      // Act
      const token = AuthDomainService.generateToken(accountId);

      // Assert
      expect(token).toBeDefined();
      expect(typeof token).toBe("string");
      expect(token.split(".")).toHaveLength(3); // JWT has 3 parts
    });
  });

  describe("verifyToken", () => {
    it("should verify valid token", () => {
      // Arrange
      const accountId = "test-account-id";
      const token = AuthDomainService.generateToken(accountId);

      // Act
      const decoded = AuthDomainService.verifyToken(token);

      // Assert
      expect(decoded.accountId).toBe(accountId);
    });

    it("should throw error for invalid token", () => {
      // Arrange
      const invalidToken = "invalid.token.here";

      // Act & Assert
      expect(() => AuthDomainService.verifyToken(invalidToken)).toThrow(
        "Invalid token"
      );
    });
  });
});
