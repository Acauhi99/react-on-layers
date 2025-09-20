import {
  AccountRepository,
  type Account,
} from "../repositories/account.repository.js";

export class AccountService {
  private accountRepo = new AccountRepository();

  async getAccountByEmail(email: string): Promise<Account | null> {
    return this.accountRepo.findByEmail(email) || null;
  }

  async getAccountById(id: string): Promise<Account | null> {
    return this.accountRepo.findById(id) || null;
  }

  async updateAccount(
    id: string,
    data: { email?: string; name?: string; password?: string }
  ): Promise<Account> {
    const account = this.accountRepo.findById(id);
    if (!account) {
      throw new Error("Account not found");
    }

    if (data.email && data.email !== account.email) {
      const existingAccount = this.accountRepo.findByEmail(data.email);
      if (existingAccount) {
        throw new Error("Email already in use");
      }
    }

    this.accountRepo.update(id, data);
    return this.accountRepo.findById(id)!;
  }

  async deleteAccount(id: string): Promise<void> {
    const account = this.accountRepo.findById(id);
    if (!account) {
      throw new Error("Account not found");
    }

    this.accountRepo.delete(id);
  }
}
