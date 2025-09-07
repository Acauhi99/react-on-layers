import { useState } from "react";
import { z } from "zod";
import { SignupForm } from "./SignupForm";
import { toast } from "sonner";

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
  const [touched, setTouched] = useState<{ [k: string]: boolean }>({});
  const [fieldErrors, setFieldErrors] = useState<{ [k: string]: string }>({});
  const [localError, setLocalError] = useState<string | null>(null);

  function validateField(name: string, value: string | boolean) {
    const partial = { ...form, [name]: value };
    const result = signupSchema.safeParse(partial);
    if (!result.success) {
      const issue = result.error.issues.find((i) => i.path[0] === name);
      setFieldErrors((prev) => ({ ...prev, [name]: issue?.message || "" }));
    } else {
      setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === "checkbox" ? checked : value;
    setForm((prev) => ({
      ...prev,
      [name]: fieldValue,
    }));
    if (touched[name]) validateField(name, fieldValue);
  }

  function handleCheckedChange(checked: boolean) {
    setForm((prev) => ({
      ...prev,
      acceptedTerms: checked,
    }));
    if (touched["acceptedTerms"]) validateField("acceptedTerms", checked);
  }

  function handleBlur(e: React.FocusEvent<HTMLInputElement>) {
    const { name, value, type, checked } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    validateField(name, type === "checkbox" ? checked : value);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLocalError(null);
    const result = signupSchema.safeParse(form);
    if (!result.success) {
      const firstError = result.error.issues[0];
      setLocalError(firstError?.message || "Dados inválidos");
      toast.error(firstError?.message || "Dados inválidos");
      setTouched({
        name: true,
        birthdate: true,
        email: true,
        password: true,
        confirmPassword: true,
        acceptedTerms: true,
      });
      result.error.issues.forEach((issue) => {
        setFieldErrors((prev) => ({
          ...prev,
          [issue.path[0] as string]: issue.message,
        }));
      });
      return;
    }
    onSubmit({
      email: form.email,
      password: form.password,
      name: form.name,
      birthdate: form.birthdate,
    });
    toast.success("Cadastro realizado com sucesso!");
  }

  return (
    <SignupForm
      values={form}
      onChange={handleChange}
      onCheckedChange={handleCheckedChange}
      onBlur={handleBlur}
      fieldErrors={fieldErrors}
      onSubmit={handleSubmit}
      loading={loading}
      error={error || localError}
    />
  );
}
