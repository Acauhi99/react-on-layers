import { Database } from "bun:sqlite";
import { config } from "../../config/env.js";

class DatabaseWrapper {
  private db: Database;

  constructor() {
    this.db = new Database(config.database.path);
    this.init();
  }

  private init() {
    this.db.exec("PRAGMA foreign_keys = ON");

    // Accounts table for multi-user support
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS accounts (
        id TEXT PRIMARY KEY,
        email TEXT NOT NULL UNIQUE,
        name TEXT NOT NULL,
        password TEXT NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        modified_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Categories for expenses and income (per account)
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS categories (
        id TEXT PRIMARY KEY,
        account_id TEXT NOT NULL,
        name TEXT NOT NULL,
        type TEXT CHECK(type IN ('income', 'expense')) NOT NULL,
        color TEXT NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        modified_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (account_id) REFERENCES accounts(id) ON UPDATE CASCADE ON DELETE CASCADE
      )
    `);

    // Monthly transactions (income and expenses)
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS transactions (
        id TEXT PRIMARY KEY,
        account_id TEXT NOT NULL,
        amount DECIMAL(15,2) NOT NULL,
        description TEXT NOT NULL,
        category_id TEXT NOT NULL,
        date DATE NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        modified_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (account_id) REFERENCES accounts(id) ON UPDATE CASCADE ON DELETE CASCADE,
        FOREIGN KEY (category_id) REFERENCES categories(id) ON UPDATE CASCADE ON DELETE RESTRICT
      )
    `);

    // Investment types/platforms (shared across accounts)
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS investment_types (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL UNIQUE,
        description TEXT
      )
    `);

    // Investment allocations (per account)
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS investments (
        id TEXT PRIMARY KEY,
        account_id TEXT NOT NULL,
        name TEXT NOT NULL,
        investment_type_id TEXT NOT NULL,
        amount DECIMAL(15,2) NOT NULL,
        date DATE NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        modified_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (account_id) REFERENCES accounts(id) ON UPDATE CASCADE ON DELETE CASCADE,
        FOREIGN KEY (investment_type_id) REFERENCES investment_types(id) ON UPDATE CASCADE ON DELETE RESTRICT
      )
    `);

    // Monthly balance snapshots for performance (per account)
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS monthly_balances (
        id TEXT PRIMARY KEY,
        account_id TEXT NOT NULL,
        year INTEGER NOT NULL,
        month INTEGER NOT NULL,
        total_income DECIMAL(15,2) DEFAULT 0,
        total_expenses DECIMAL(15,2) DEFAULT 0,
        net_balance DECIMAL(15,2) DEFAULT 0,
        total_investments DECIMAL(15,2) DEFAULT 0,
        available_to_invest DECIMAL(15,2) DEFAULT 0,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        modified_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (account_id) REFERENCES accounts(id) ON UPDATE CASCADE ON DELETE CASCADE,
        UNIQUE(account_id, year, month)
      )
    `);

    this.createIndexes();
    this.migrate();
  }

  private createIndexes() {
    // Performance indexes for common queries
    this.db.exec(
      "CREATE INDEX IF NOT EXISTS idx_accounts_email ON accounts(email)"
    );
    this.db.exec(
      "CREATE INDEX IF NOT EXISTS idx_categories_account ON categories(account_id)"
    );
    this.db.exec(
      "CREATE INDEX IF NOT EXISTS idx_transactions_account ON transactions(account_id)"
    );
    this.db.exec(
      "CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date)"
    );
    this.db.exec(
      "CREATE INDEX IF NOT EXISTS idx_transactions_category ON transactions(category_id)"
    );
    this.db.exec(
      "CREATE INDEX IF NOT EXISTS idx_investments_account ON investments(account_id)"
    );
    this.db.exec(
      "CREATE INDEX IF NOT EXISTS idx_investments_type ON investments(investment_type_id)"
    );
    this.db.exec(
      "CREATE INDEX IF NOT EXISTS idx_investments_date ON investments(date)"
    );
    this.db.exec(
      "CREATE INDEX IF NOT EXISTS idx_monthly_balances_account ON monthly_balances(account_id)"
    );
    this.db.exec(
      "CREATE INDEX IF NOT EXISTS idx_monthly_balances_period ON monthly_balances(year, month)"
    );
  }

  private migrate() {
    // Check if we need to migrate from old schema
    const hasAccountsTable = this.db
      .prepare(
        `
      SELECT COUNT(*) as count FROM sqlite_master
      WHERE type='table' AND name='accounts'
    `
      )
      .get() as { count: number };

    if (hasAccountsTable.count === 0) {
      // This is a fresh database, no migration needed
      this.insertDefaultData();
      return;
    }

    // Check if categories table has account_id column
    const hasAccountIdInCategories = this.db
      .prepare(
        `
      SELECT COUNT(*) as count FROM pragma_table_info('categories')
      WHERE name = 'account_id'
    `
      )
      .get() as { count: number };

    if (hasAccountIdInCategories.count === 0) {
      console.log("Migrating database schema...");
      // Need to recreate tables with new schema
      this.db.exec("DROP TABLE IF EXISTS monthly_balances");
      this.db.exec("DROP TABLE IF EXISTS investments");
      this.db.exec("DROP TABLE IF EXISTS transactions");
      this.db.exec("DROP TABLE IF EXISTS categories");

      // Recreate with new schema (init() already created them)
    }

    this.insertDefaultData();
  }

  private insertDefaultData() {
    // Insert default investment types
    this.db.exec(`
      INSERT OR IGNORE INTO investment_types (id, name, description) VALUES
      ('stocks', 'Ações', 'Investimentos em ações'),
      ('bonds', 'Renda Fixa', 'CDB, Tesouro Direto, etc'),
      ('funds', 'Fundos', 'Fundos de investimento'),
      ('crypto', 'Criptomoedas', 'Bitcoin, Ethereum, etc'),
      ('real_estate', 'Imóveis', 'Fundos imobiliários')
    `);
  }

  run(sql: string, params: any[] = []): void {
    this.db.prepare(sql).run(params);
  }

  get<T>(sql: string, params: any[] = []): T | undefined {
    return this.db.prepare(sql).get(params) as T | undefined;
  }

  all<T>(sql: string, params: any[] = []): T[] {
    return this.db.prepare(sql).all(params) as T[];
  }
}

export const db = new DatabaseWrapper();
export type { Database };
