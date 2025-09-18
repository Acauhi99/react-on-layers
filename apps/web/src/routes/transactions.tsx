import { createFileRoute } from "@tanstack/react-router";
import { AddTransactionForm } from "@/features/financial/transactions/AddTransactionForm";

export const Route = createFileRoute("/transactions")({
  component: () => (
    <div className="p-6">
      <AddTransactionForm />
    </div>
  ),
});
