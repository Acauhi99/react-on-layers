import { describe, it, expect } from "bun:test";
import { generateUUID } from "../../../src/utils/uuid.js";

describe("UUID Utils", () => {
  describe("generateUUID", () => {
    it("should generate valid UUID v7", () => {
      // Arrange & Act
      const id = generateUUID();

      // Assert
      expect(id).toBeDefined();
      expect(typeof id).toBe("string");
      expect(id).toHaveLength(36); // UUID format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
      expect(id).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
      );
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
