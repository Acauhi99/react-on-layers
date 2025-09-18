export interface Transaction {
  id: string
  amount: number
  description: string
  category: string
  type: 'income' | 'expense'
  date: string
  createdAt: string
}

export interface Category {
  id: string
  name: string
  type: 'income' | 'expense'
  color: string
}