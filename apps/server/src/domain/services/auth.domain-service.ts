import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Account } from "../entities/account.entity.js";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

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
    return jwt.sign({ accountId }, JWT_SECRET, { expiresIn: "7d" });
  }

  static verifyToken(token: string): { accountId: string } {
    try {
      return jwt.verify(token, JWT_SECRET) as { accountId: string };
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
