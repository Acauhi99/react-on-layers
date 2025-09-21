import { describe, it, expect, beforeEach } from "bun:test";
import { MemoryCache } from "./memory-cache";

describe("MemoryCache", () => {
  let cache: MemoryCache;

  beforeEach(() => {
    cache = new MemoryCache();
  });

  describe("set and get", () => {
    it("should store and retrieve data", () => {
      // Arrange
      const key = "test-key";
      const data = { id: 1, name: "Test" };

      // Act
      cache.set(key, data);
      const result = cache.get(key);

      // Assert
      expect(result).toEqual(data);
    });

    it("should return null for non-existent key", () => {
      // Arrange
      const key = "non-existent";

      // Act
      const result = cache.get(key);

      // Assert
      expect(result).toBeNull();
    });

    it("should respect custom TTL", async () => {
      // Arrange
      const key = "short-ttl";
      const data = "test-data";
      const shortTTL = 10; // 10ms

      // Act
      cache.set(key, data, shortTTL);
      const immediate = cache.get(key);

      await new Promise((resolve) => setTimeout(resolve, 20)); // Wait 20ms
      const afterExpiry = cache.get(key);

      // Assert
      expect(immediate).toBe(data);
      expect(afterExpiry).toBeNull();
    });
  });

  describe("delete", () => {
    it("should remove item from cache", () => {
      // Arrange
      const key = "delete-test";
      const data = "test-data";
      cache.set(key, data);

      // Act
      cache.delete(key);
      const result = cache.get(key);

      // Assert
      expect(result).toBeNull();
    });
  });

  describe("clear", () => {
    it("should remove all items from cache", () => {
      // Arrange
      cache.set("key1", "data1");
      cache.set("key2", "data2");

      // Act
      cache.clear();

      // Assert
      expect(cache.get("key1")).toBeNull();
      expect(cache.get("key2")).toBeNull();
    });
  });

  describe("invalidatePattern", () => {
    it("should remove items matching pattern", () => {
      // Arrange
      cache.set("user:123:profile", "profile-data");
      cache.set("user:123:settings", "settings-data");
      cache.set("user:456:profile", "other-profile");
      cache.set("product:123", "product-data");

      // Act
      cache.invalidatePattern("user:123");

      // Assert
      expect(cache.get("user:123:profile")).toBeNull();
      expect(cache.get("user:123:settings")).toBeNull();
      expect(cache.get("user:456:profile")).toBe("other-profile");
      expect(cache.get("product:123")).toBe("product-data");
    });
  });
});
