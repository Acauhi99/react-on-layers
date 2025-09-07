import { useState } from "react";
import { z } from "zod";
import { LoginForm } from "./LoginForm";
import { toast } from "sonner";

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
  const [touched, setTouched] = useState<{ [k: string]: boolean }>({});
  const [fieldErrors, setFieldErrors] = useState<{ [k: string]: string }>({});
  const [localError, setLocalError] = useState<string | null>(null);

  function validateField(name: string, value: string) {
    const partial = { ...form, [name]: value };
    const result = loginSchema.safeParse(partial);
    if (!result.success) {
      const issue = result.error.issues.find((i) => i.path[0] === name);
      setFieldErrors((prev) => ({ ...prev, [name]: issue?.message || "" }));
    } else {
      setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (touched[name]) validateField(name, value);
  }

  function handleBlur(e: React.FocusEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    validateField(name, value);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLocalError(null);
    const result = loginSchema.safeParse(form);
    if (!result.success) {
      const firstError = result.error.issues[0];
      setLocalError(firstError?.message || "Dados inválidos");
      toast.error(firstError?.message || "Dados inválidos");
      setTouched({ email: true, password: true });
      result.error.issues.forEach((issue) => {
        setFieldErrors((prev) => ({
          ...prev,
          [issue.path[0] as string]: issue.message,
        }));
      });
      return;
    }
    onSubmit(form);
    toast.success("Login realizado com sucesso!");
  }

  return (
    <LoginForm
      values={form}
      onChange={handleChange}
      onBlur={handleBlur}
      fieldErrors={fieldErrors}
      onSubmit={handleSubmit}
      loading={loading}
      error={error || localError}
    />
  );
}
