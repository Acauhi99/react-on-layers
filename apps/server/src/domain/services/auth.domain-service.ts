import bcrypt from "bcryptjs";
import jwt, { SignOptions } from "jsonwebtoken";
import { config } from "../../config/env.js";
import { Account } from "../entities/account.entity.js";

export class AuthDomainService {
  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  static async verifyPassword(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  static generateToken(accountId: string): string {
    return jwt.sign(
      { accountId },
      config.security.jwtSecret as string,
      { expiresIn: config.security.jwtExpiresIn } as SignOptions
    );
  }

  static verifyToken(token: string): { accountId: string } {
    try {
      return jwt.verify(token, config.security.jwtSecret as string) as {
        accountId: string;
      };
    } catch (error) {
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
