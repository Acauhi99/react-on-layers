import { hash, verify } from "@node-rs/bcrypt";
import jwt from "jsonwebtoken";
import { config } from "../../config/env.js";
import { Account } from "../entities/account.entity.js";

export class AuthDomainService {
  static async hashPassword(password: string): Promise<string> {
    return hash(password, 10);
  }

  static async verifyPassword(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    return verify(password, hashedPassword);
  }

  static generateToken(account: {
    id: string;
    email: string;
    name: string;
  }): string {
    const payload = {
      accountId: account.id,
      email: account.email,
      name: account.name,
    };
    const secret = config.security.jwtSecret;
    const options = { expiresIn: "7d" as const };

    return jwt.sign(payload, secret, options);
  }

  static verifyToken(token: string): {
    accountId: string;
    email: string;
    name: string;
  } {
    try {
      return jwt.verify(token, config.security.jwtSecret) as {
        accountId: string;
        email: string;
        name: string;
      };
    } catch {
      throw new Error("Invalid token");
    }
  }

  static createAccountFromRegistration(
    id: string,
    email: string,
    name: string,
    hashedPassword: string
  ): Account {
    return Account.create(id, email, name, hashedPassword);
  }
}
