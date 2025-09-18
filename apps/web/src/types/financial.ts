export interface Transaction {
  id: string;
  amount: number;
  description: string;
  category: string;
  type: "income" | "expense";
  date: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  type: "income" | "expense";
  color: string;
}

export interface Budget {
  id: string;
  category: string;
  limit: number;
  period: "monthly" | "yearly";
  spent: number;
}

export interface Investment {
  id: string;
  name: string;
  amount: number;
  expectedReturn: number;
  type: "stocks" | "bonds" | "crypto" | "savings";
  startDate: string;
}
