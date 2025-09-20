import { describe, it, expect } from "bun:test";

describe("Environment Configuration", () => {
  describe("config object", () => {
    it("should have server configuration with defaults", () => {
      // Arrange & Act
      const { config } = require("../../../src/config/env.js");

      // Assert
      expect(config.server).toBeDefined();
      expect(config.server.port).toBeGreaterThan(0);
      expect(config.server.host).toBeDefined();
      expect(config.server.nodeEnv).toBeDefined();
    });

    it("should have security configuration", () => {
      // Arrange & Act
      const { config } = require("../../../src/config/env.js");

      // Assert
      expect(config.security).toBeDefined();
      expect(config.security.jwtSecret).toBeDefined();
      expect(config.security.jwtExpiresIn).toBeDefined();
    });

    it("should have database configuration", () => {
      // Arrange & Act
      const { config } = require("../../../src/config/env.js");

      // Assert
      expect(config.database).toBeDefined();
      expect(config.database.path).toBeDefined();
    });

    it("should have cache configuration with numeric values", () => {
      // Arrange & Act
      const { config } = require("../../../src/config/env.js");

      // Assert
      expect(config.cache).toBeDefined();
      expect(typeof config.cache.defaultTTL).toBe("number");
      expect(typeof config.cache.categoryTTL).toBe("number");
      expect(typeof config.cache.investmentTTL).toBe("number");
      expect(typeof config.cache.transactionTTL).toBe("number");
      expect(typeof config.cache.reportTTL).toBe("number");
    });

    it("should have CORS configuration", () => {
      // Arrange & Act
      const { config } = require("../../../src/config/env.js");

      // Assert
      expect(config.cors).toBeDefined();
      expect(Array.isArray(config.cors.origin)).toBe(true);
    });

    it("should have rate limiting configuration", () => {
      // Arrange & Act
      const { config } = require("../../../src/config/env.js");

      // Assert
      expect(config.rateLimit).toBeDefined();
      expect(typeof config.rateLimit.max).toBe("number");
      expect(typeof config.rateLimit.windowMs).toBe("number");
    });
  });
});
