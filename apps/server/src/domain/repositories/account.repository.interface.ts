import { Account } from "../entities/account.entity.js";

export interface IAccountRepository {
  save(account: Account): Promise<void>;
  findById(id: string): Promise<Account | null>;
  findByEmail(email: string): Promise<Account | null>;
  update(account: Account): Promise<void>;
  delete(id: string): Promise<void>;
}
