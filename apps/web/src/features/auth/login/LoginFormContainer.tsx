import { useState } from "react";
import { z } from "zod";
import { LoginForm } from "./LoginForm";

const loginSchema = z.object({
  email: z.email({ message: "Email inválido" }),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
});

export interface LoginFormContainerProps {
  onSubmit: (data: { email: string; password: string }) => void;
  loading?: boolean;
  error?: string | null;
}

export function LoginFormContainer({
  onSubmit,
  loading,
  error,
}: LoginFormContainerProps) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [localError, setLocalError] = useState<string | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLocalError(null);
    const result = loginSchema.safeParse(form);
    if (!result.success) {
      const firstError = result.error.issues[0];
      setLocalError(firstError?.message || "Dados inválidos");
      return;
    }
    onSubmit(form);
  }

  return (
    <LoginForm
      values={form}
      onChange={handleChange}
      onSubmit={handleSubmit}
      loading={loading}
      error={error || localError}
    />
  );
}
