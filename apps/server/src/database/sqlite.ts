import { Database } from 'bun:sqlite'

class DatabaseWrapper {
  private db: Database

  constructor() {
    this.db = new Database('financial.db')
    this.init()
  }

  private init() {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS categories (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        color TEXT NOT NULL
      )
    `)

    this.db.exec(`
      CREATE TABLE IF NOT EXISTS transactions (
        id TEXT PRIMARY KEY,
        amount REAL NOT NULL,
        description TEXT NOT NULL,
        category TEXT NOT NULL,
        type TEXT NOT NULL,
        date TEXT NOT NULL,
        createdAt TEXT NOT NULL
      )
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