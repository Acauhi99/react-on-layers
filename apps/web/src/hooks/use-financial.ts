import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { financialService } from '@/services/financial.service'
import type { Transaction, Category } from '@/types/financial'

// Camada de Fluxo (React Query Hooks)
export function useTransactions() {
  return useQuery({
    queryKey: ['transactions'],
    queryFn: () => financialService.getTransactions(),
  })
}

export function useCreateTransaction() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: Omit<Transaction, 'id' | 'createdAt'>) =>
      financialService.createTransaction(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      queryClient.invalidateQueries({ queryKey: ['balance'] })
    },
  })
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => financialService.getCategories(),
  })
}

export function useCreateCategory() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: Omit<Category, 'id'>) =>
      financialService.createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    },
  })
}

export function useBalance() {
  return useQuery({
    queryKey: ['balance'],
    queryFn: () => financialService.getBalance(),
  })
}

export function useMonthlyExpenses(year: number, month: number) {
  return useQuery({
    queryKey: ['monthly-expenses', year, month],
    queryFn: () => financialService.getMonthlyExpensesByCategory(year, month),
  })
}

export function useInvestmentProjection() {
  return {
    calculate: (monthlyAmount: number, annualReturn: number, years: number) =>
      financialService.calculateInvestmentProjection(monthlyAmount, annualReturn, years)
  }
}