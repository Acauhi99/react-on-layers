import { Database } from 'bun:sqlite'

class DatabaseWrapper {
  private db: Database

  constructor() {
    this.db = new Database('financial.db')
    this.init()
  }

  private init() {
    this.db.exec('PRAGMA foreign_keys = ON')
    
    // Categories for expenses and income
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS categories (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        type TEXT CHECK(type IN ('income', 'expense')) NOT NULL,
        color TEXT NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Monthly transactions (income and expenses)
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS transactions (
        id TEXT PRIMARY KEY,
        amount DECIMAL(15,2) NOT NULL,
        description TEXT NOT NULL,
        category_id TEXT NOT NULL,
        date DATE NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (category_id) REFERENCES categories(id) ON UPDATE CASCADE ON DELETE RESTRICT
      )
    `)

    // Investment types/platforms
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS investment_types (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL UNIQUE,
        description TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Investment allocations
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS investments (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        investment_type_id TEXT NOT NULL,
        amount DECIMAL(15,2) NOT NULL,
        date DATE NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (investment_type_id) REFERENCES investment_types(id) ON UPDATE CASCADE ON DELETE RESTRICT
      )
    `)

    // Monthly balance snapshots for performance
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS monthly_balances (
        id TEXT PRIMARY KEY,
        year INTEGER NOT NULL,
        month INTEGER NOT NULL,
        total_income DECIMAL(15,2) DEFAULT 0,
        total_expenses DECIMAL(15,2) DEFAULT 0,
        net_balance DECIMAL(15,2) DEFAULT 0,
        total_investments DECIMAL(15,2) DEFAULT 0,
        available_to_invest DECIMAL(15,2) DEFAULT 0,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(year, month)
      )
    `)

    this.createIndexes()
    this.migrate()
  }

  private createIndexes() {
    // Performance indexes for common queries
    this.db.exec('CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date)')
    this.db.exec('CREATE INDEX IF NOT EXISTS idx_transactions_category ON transactions(category_id)')
    this.db.exec('CREATE INDEX IF NOT EXISTS idx_investments_type ON investments(investment_type_id)')
    this.db.exec('CREATE INDEX IF NOT EXISTS idx_investments_date ON investments(date)')
    this.db.exec('CREATE INDEX IF NOT EXISTS idx_monthly_balances_period ON monthly_balances(year, month)')
  }

  private migrate() {
    // Insert default investment types
    this.db.exec(`
      INSERT OR IGNORE INTO investment_types (id, name, description) VALUES 
      ('stocks', 'Ações', 'Investimentos em ações'),
      ('bonds', 'Renda Fixa', 'CDB, Tesouro Direto, etc'),
      ('funds', 'Fundos', 'Fundos de investimento'),
      ('crypto', 'Criptomoedas', 'Bitcoin, Ethereum, etc'),
      ('real_estate', 'Imóveis', 'Fundos imobiliários')
    `)
  }



  run(sql: string, params: any[] = []): void {
    this.db.prepare(sql).run(params)
  }

  get<T>(sql: string, params: any[] = []): T | undefined {
    return this.db.prepare(sql).get(params) as T | undefined
  }

  all<T>(sql: string, params: any[] = []): T[] {
    return this.db.prepare(sql).all(params) as T[]
  }


}

export const db = new DatabaseWrapper()
export type { Database }