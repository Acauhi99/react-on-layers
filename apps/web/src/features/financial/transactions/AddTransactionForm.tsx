import { useForm } from "@tanstack/react-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useCreateTransaction, useCategories } from "@/hooks/use-financial";
import { toast } from "sonner";

export function AddTransactionForm() {
  const createTransaction = useCreateTransaction();
  const { data: categories } = useCategories();

  const form = useForm({
    defaultValues: {
      amount: 0,
      description: "",
      category: "",
      type: "expense" as "income" | "expense",
      date: new Date().toISOString().split("T")[0],
    },
    onSubmit: async ({ value }) => {
      try {
        await createTransaction.mutateAsync(value);
        toast.success("Transação adicionada com sucesso!");
        form.reset();
      } catch {
        toast.error("Erro ao adicionar transação");
      }
    },
  });

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Nova Transação</h2>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        className="space-y-4"
      >
        <div className="grid grid-cols-2 gap-4">
          <form.Field name="type">
            {(field) => (
              <div>
                <Label>Tipo</Label>
                <select
                  value={field.state.value}
                  onChange={(e) =>
                    field.handleChange(e.target.value as "income" | "expense")
                  }
                  className="w-full p-2 border rounded"
                >
                  <option value="expense">Despesa</option>
                  <option value="income">Receita</option>
                </select>
              </div>
            )}
          </form.Field>

          <form.Field name="amount">
            {(field) => (
              <div>
                <Label>Valor</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(Number(e.target.value))}
                  placeholder="0.00"
                />
              </div>
            )}
          </form.Field>
        </div>

        <form.Field name="description">
          {(field) => (
            <div>
              <Label>Descrição</Label>
              <Input
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="Ex: Almoço, Salário..."
              />
            </div>
          )}
        </form.Field>

        <div className="grid grid-cols-2 gap-4">
          <form.Field name="category">
            {(field) => (
              <div>
                <Label>Categoria</Label>
                <select
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Selecione...</option>
                  {categories?.map((cat) => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </form.Field>

          <form.Field name="date">
            {(field) => (
              <div>
                <Label>Data</Label>
                <Input
                  type="date"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </div>
            )}
          </form.Field>
        </div>

        <Button
          type="submit"
          disabled={createTransaction.isPending}
          className="w-full"
        >
          {createTransaction.isPending ? "Salvando..." : "Adicionar Transação"}
        </Button>
      </form>
    </Card>
  );
}
