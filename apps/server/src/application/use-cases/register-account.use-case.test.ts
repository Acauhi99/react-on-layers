import { IAccountRepository } from "@/domain/repositories/account.repository.interface";
import { describe, it, expect, mock } from "bun:test";
import { RegisterAccountUseCase } from "./register-account.use-case";
import { Account } from "@/domain/entities/account.entity";

describe("RegisterAccountUseCase", () => {
  const mockAccountRepository: IAccountRepository = {
    save: mock(() => Promise.resolve()),
    findById: mock(() => Promise.resolve(null)),
    findByEmail: mock(() => Promise.resolve(null)),
    update: mock(() => Promise.resolve()),
    delete: mock(() => Promise.resolve()),
  };

  describe("execute", () => {
    it("should register new account successfully", async () => {
      // Arrange
      const useCase = new RegisterAccountUseCase(mockAccountRepository);
      const request = {
        email: "test@example.com",
        name: "Test User",
        password: "password123",
      };

      mockAccountRepository.findByEmail = mock(() => Promise.resolve(null));
      mockAccountRepository.save = mock(() => Promise.resolve());

      // Act
      const result = await useCase.execute(request);

      // Assert
      expect(result.token).toBeDefined();
      expect(typeof result.token).toBe("string");
      expect(result.token.split(".")).toHaveLength(3); // JWT format
      expect(mockAccountRepository.findByEmail).toHaveBeenCalledWith(
        request.email
      );
      expect(mockAccountRepository.save).toHaveBeenCalled();
    });

    it("should throw error when email already exists", async () => {
      // Arrange
      const useCase = new RegisterAccountUseCase(mockAccountRepository);
      const request = {
        email: "existing@example.com",
        name: "Test User",
        password: "password123",
      };

      const existingAccount = Account.create(
        "id",
        request.email,
        "Existing User",
        "hashedPassword"
      );
      mockAccountRepository.findByEmail = mock(() =>
        Promise.resolve(existingAccount)
      );

      // Act & Assert
      expect(useCase.execute(request)).rejects.toThrow(
        "Account with this email already exists"
      );
      expect(mockAccountRepository.findByEmail).toHaveBeenCalledWith(
        request.email
      );
    });
  });
});
