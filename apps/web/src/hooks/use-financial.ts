import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { financialService } from "@/services/financial.service";
import type { Transaction, Category } from "@/types/financial";

export function useTransactions() {
  return useQuery({
    queryKey: ["transactions"],
    queryFn: () => financialService.getTransactions(),
    meta: {
      onError: (error: Error) => toast.error(error.message),
    },
  });
}

export function useCreateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Omit<Transaction, "id" | "createdAt">) =>
      financialService.createTransaction(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["balance"] });
      toast.success("Transação criada com sucesso!");
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => financialService.getCategories(),
    meta: {
      onError: (error: Error) => toast.error(error.message),
    },
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Omit<Category, "id">) =>
      financialService.createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}

export function useBalance() {
  return useQuery({
    queryKey: ["balance"],
    queryFn: () => financialService.getBalance(),
    meta: {
      onError: (error: Error) => toast.error(error.message),
    },
  });
}

export function useMonthlyExpenses(year: number, month: number) {
  return useQuery({
    queryKey: ["monthly-expenses", year, month],
    queryFn: () => financialService.getMonthlyExpensesByCategory(year, month),
    meta: {
      onError: (error: Error) => toast.error(error.message),
    },
  });
}

export function useInvestmentProjection() {
  return {
    calculate: (monthlyAmount: number, annualReturn: number, years: number) =>
      financialService.calculateInvestmentProjection(
        monthlyAmount,
        annualReturn,
        years
      ),
  };
}
