import { describe, it, expect } from "bun:test";
import { config } from "./env";

describe("Environment Configuration", () => {
  describe("config object", () => {
    it("should have server configuration with defaults", () => {
      expect(config.server).toBeDefined();
      expect(config.server.port).toBeGreaterThan(0);
      expect(config.server.host).toBeDefined();
      expect(config.server.nodeEnv).toBeDefined();
    });

    it("should have security configuration", () => {
      expect(config.security).toBeDefined();
      expect(config.security.jwtSecret).toBeDefined();
      expect(config.security.jwtExpiresIn).toBeDefined();
    });

    it("should have database configuration", () => {
      expect(config.database).toBeDefined();
      expect(config.database.path).toBeDefined();
    });

    it("should have cache configuration with numeric values", () => {
      expect(config.cache).toBeDefined();
      expect(typeof config.cache.defaultTTL).toBe("number");
      expect(typeof config.cache.categoryTTL).toBe("number");
      expect(typeof config.cache.investmentTTL).toBe("number");
      expect(typeof config.cache.transactionTTL).toBe("number");
      expect(typeof config.cache.reportTTL).toBe("number");
    });

    it("should have CORS configuration", () => {
      expect(config.cors).toBeDefined();
      expect(Array.isArray(config.cors.origin)).toBe(true);
    });

    it("should have rate limiting configuration", () => {
      expect(config.rateLimit).toBeDefined();
      expect(typeof config.rateLimit.max).toBe("number");
      expect(typeof config.rateLimit.windowMs).toBe("number");
    });
  });
});
