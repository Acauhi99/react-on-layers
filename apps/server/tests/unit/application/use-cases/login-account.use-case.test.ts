import { describe, it, expect, mock } from "bun:test";
import { LoginAccountUseCase } from "../../../../src/application/use-cases/login-account.use-case.js";
import { IAccountRepository } from "../../../../src/domain/repositories/account.repository.interface.js";
import { Account } from "../../../../src/domain/entities/account.entity.js";
import { AuthDomainService } from "../../../../src/domain/services/auth.domain-service.js";

describe("LoginAccountUseCase", () => {
  const mockAccountRepository: IAccountRepository = {
    save: mock(() => Promise.resolve()),
    findById: mock(() => Promise.resolve(null)),
    findByEmail: mock(() => Promise.resolve(null)),
    update: mock(() => Promise.resolve()),
    delete: mock(() => Promise.resolve()),
  };

  describe("execute", () => {
    it("should login with valid credentials", async () => {
      // Arrange
      const useCase = new LoginAccountUseCase(mockAccountRepository);
      const hashedPassword = await AuthDomainService.hashPassword(
        "password123"
      );
      const account = Account.create(
        "id",
        "test@example.com",
        "Test User",
        hashedPassword
      );

      const request = {
        email: "test@example.com",
        password: "password123",
      };

      mockAccountRepository.findByEmail = mock(() => Promise.resolve(account));

      // Act
      const result = await useCase.execute(request);

      // Assert
      expect(result.account.email).toBe(request.email);
      expect(result.account.name).toBe(account.name);
      expect(result.token).toBeDefined();
      expect(mockAccountRepository.findByEmail).toHaveBeenCalledWith(
        request.email
      );
    });

    it("should throw error for non-existent email", async () => {
      // Arrange
      const useCase = new LoginAccountUseCase(mockAccountRepository);
      const request = {
        email: "nonexistent@example.com",
        password: "password123",
      };

      mockAccountRepository.findByEmail = mock(() => Promise.resolve(null));

      // Act & Assert
      expect(useCase.execute(request)).rejects.toThrow("Invalid credentials");
      expect(mockAccountRepository.findByEmail).toHaveBeenCalledWith(
        request.email
      );
    });

    it("should throw error for wrong password", async () => {
      // Arrange
      const useCase = new LoginAccountUseCase(mockAccountRepository);
      const hashedPassword = await AuthDomainService.hashPassword(
        "correctPassword"
      );
      const account = Account.create(
        "id",
        "test@example.com",
        "Test User",
        hashedPassword
      );

      const request = {
        email: "test@example.com",
        password: "wrongPassword",
      };

      mockAccountRepository.findByEmail = mock(() => Promise.resolve(account));

      // Act & Assert
      expect(useCase.execute(request)).rejects.toThrow("Invalid credentials");
    });
  });
});
