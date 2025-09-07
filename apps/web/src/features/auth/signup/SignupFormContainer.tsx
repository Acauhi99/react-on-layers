import { useState } from "react";
import { z } from "zod";
import { SignupForm } from "./SignupForm";

const signupSchema = z
  .object({
    name: z.string().min(2, "Nome obrigatório"),
    birthdate: z.string().min(1, "Data de nascimento obrigatória"),
    email: z.email({ message: "Email inválido" }),
    password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
    confirmPassword: z.string().min(6, "Confirme sua senha"),
    acceptedTerms: z.literal(true, {
      message: "Você precisa aceitar os termos de uso",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

export interface SignupFormContainerProps {
  onSubmit: (data: {
    email: string;
    password: string;
    name: string;
    birthdate: string;
  }) => void;
  loading?: boolean;
  error?: string | null;
}

export function SignupFormContainer({
  onSubmit,
  loading,
  error,
}: SignupFormContainerProps) {
  const [form, setForm] = useState({
    name: "",
    birthdate: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptedTerms: false,
  });
  const [localError, setLocalError] = useState<string | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function handleCheckedChange(checked: boolean) {
    setForm((prev) => ({
      ...prev,
      acceptedTerms: checked,
    }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLocalError(null);
    const result = signupSchema.safeParse(form);
    if (!result.success) {
      const firstError = result.error.issues[0];
      setLocalError(firstError?.message || "Dados inválidos");
      return;
    }
    onSubmit({
      email: form.email,
      password: form.password,
      name: form.name,
      birthdate: form.birthdate,
    });
  }

  return (
    <SignupForm
      values={form}
      onChange={handleChange}
      onCheckedChange={handleCheckedChange}
      onSubmit={handleSubmit}
      loading={loading}
      error={error || localError}
    />
  );
}
