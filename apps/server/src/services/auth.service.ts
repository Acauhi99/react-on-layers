import {
  AccountRepository,
  type Account,
} from "../repositories/account.repository.js";
import { generateUUID } from "../utils/uuid.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export interface LoginResponse {
  token: string;
  account: Omit<Account, "password">;
}

export class AuthService {
  private accountRepo = new AccountRepository();

  async register(
    email: string,
    name: string,
    password: string
  ): Promise<LoginResponse> {
    const existingAccount = this.accountRepo.findByEmail(email);
    if (existingAccount) {
      throw new Error("Account with this email already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const account = {
      id: generateUUID(),
      email,
      name,
      password: hashedPassword,
    };

    this.accountRepo.create(account);
    const createdAccount = this.accountRepo.findById(account.id)!;

    const token = jwt.sign({ accountId: account.id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    return {
      token,
      account: {
        id: createdAccount.id,
        email: createdAccount.email,
        name: createdAccount.name,
        created_at: createdAccount.created_at,
        modified_at: createdAccount.modified_at,
      },
    };
  }

  async login(email: string, password: string): Promise<LoginResponse> {
    const account = this.accountRepo.findByEmail(email);
    if (!account) {
      throw new Error("Invalid credentials");
    }

    const isValidPassword = await bcrypt.compare(password, account.password);
    if (!isValidPassword) {
      throw new Error("Invalid credentials");
    }

    const token = jwt.sign({ accountId: account.id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    return {
      token,
      account: {
        id: account.id,
        email: account.email,
        name: account.name,
        created_at: account.created_at,
        modified_at: account.modified_at,
      },
    };
  }

  verifyToken(token: string): { accountId: string } {
    try {
      return jwt.verify(token, JWT_SECRET) as { accountId: string };
    } catch (error) {
      throw new Error("Invalid token");
    }
  }
}
