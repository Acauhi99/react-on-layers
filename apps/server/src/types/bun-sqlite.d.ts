declare module 'bun:sqlite' {
  export class Database {
    constructor(filename?: string)
    exec(sql: string): void
    prepare(sql: string): Statement
  }

  export class Statement {
    run(...params: any[]): void
    get(...params: any[]): any
    all(...params: any[]): any[]
  }
}