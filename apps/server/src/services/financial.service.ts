import { db } from '@/database/sqlite'
import type { Transaction, Category } from '@/types'

export class FinancialService {
  // Categories
  createCategory(data: Omit<Category, 'id'>): Category {
    const id = Date.now().toString() + Math.random().toString(36).slice(2, 11)
    const category = { id, ...data }
    
    db.run(
      'INSERT INTO categories (id, name, type, color) VALUES (?, ?, ?, ?)',
      [category.id, category.name, category.type, category.color]
    )
    
    return category
  }

  getCategories(): Category[] {
    return db.all<Category>('SELECT * FROM categories ORDER BY name')
  }

  // Transactions
  createTransaction(data: Omit<Transaction, 'id' | 'createdAt'>): Transaction {
    const id = Date.now().toString() + Math.random().toString(36).slice(2, 11)
    const createdAt = new Date().toISOString()
    const transaction = { id, createdAt, ...data }
    
    db.run(
      'INSERT INTO transactions (id, amount, description, category, type, date, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [transaction.id, transaction.amount, transaction.description, transaction.category, transaction.type, transaction.date, transaction.createdAt]
    )
    
    return transaction
  }

  getTransactions(): Transaction[] {
    return db.all<Transaction>('SELECT * FROM transactions ORDER BY date DESC')
  }

  getBalance(): { income: number; expenses: number; total: number } {
    const transactions = this.getTransactions()
    const income = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0)
    const expenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0)
    
    return { income, expenses, total: income - expenses }
  }
}

export const financialService = new FinancialService()