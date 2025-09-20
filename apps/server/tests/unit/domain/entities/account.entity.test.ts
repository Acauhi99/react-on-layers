import { describe, it, expect } from "bun:test";
import { Account } from "../../../../src/domain/entities/account.entity.js";

describe("Account Entity", () => {
  describe("create", () => {
    it("should create account with valid data", () => {
      // Arrange
      const id = "test-id";
      const email = "test@example.com";
      const name = "Test User";
      const password = "hashedPassword123";

      // Act
      const account = Account.create(id, email, name, password);

      // Assert
      expect(account.id).toBe(id);
      expect(account.email).toBe(email);
      expect(account.name).toBe(name);
      expect(account.password).toBe(password);
      expect(account.createdAt).toBeInstanceOf(Date);
      expect(account.modifiedAt).toBeInstanceOf(Date);
    });
  });

  describe("update", () => {
    it("should update account name and email", () => {
      // Arrange
      const account = Account.create(
        "id",
        "old@example.com",
        "Old Name",
        "password"
      );
      const newEmail = "new@example.com";
      const newName = "New Name";

      // Act
      const updatedAccount = account.updateProfile(newName, newEmail);

      // Assert
      expect(updatedAccount.email).toBe(newEmail);
      expect(updatedAccount.name).toBe(newName);
      expect(updatedAccount.id).toBe(account.id);
      expect(updatedAccount.password).toBe(account.password);
      expect(updatedAccount.modifiedAt).not.toBe(account.modifiedAt);
    });

    it("should keep original values when no updates provided", () => {
      // Arrange
      const account = Account.create(
        "id",
        "test@example.com",
        "Test Name",
        "password"
      );

      // Act
      const updatedAccount = account.updateProfile();

      // Assert
      expect(updatedAccount.email).toBe(account.email);
      expect(updatedAccount.name).toBe(account.name);
      expect(updatedAccount.modifiedAt).not.toBe(account.modifiedAt);
    });
  });
});
