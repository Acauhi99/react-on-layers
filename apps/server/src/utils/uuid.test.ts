import { describe, it, expect } from "bun:test";
import { generateUUID } from "./uuid";

describe("UUID Utils", () => {
  describe("generateUUID", () => {
    it("should generate valid ULID", () => {
      // Arrange & Act
      const id = generateUUID();

      // Assert
      expect(id).toBeDefined();
      expect(typeof id).toBe("string");
      expect(id).toHaveLength(26); // ULID format: 26 characters
      expect(id).toMatch(/^[0123456789ABCDEFGHJKMNPQRSTVWXYZ]{26}$/i);
    });

    it("should generate unique IDs", () => {
      // Arrange & Act
      const id1 = generateUUID();
      const id2 = generateUUID();
      const id3 = generateUUID();

      // Assert
      expect(id1).not.toBe(id2);
      expect(id2).not.toBe(id3);
      expect(id1).not.toBe(id3);
    });

    it("should generate multiple unique IDs in sequence", () => {
      // Arrange
      const ids = new Set<string>();
      const count = 100;

      // Act
      for (let i = 0; i < count; i++) {
        ids.add(generateUUID());
      }

      // Assert
      expect(ids.size).toBe(count); // All IDs should be unique
    });
  });
});
