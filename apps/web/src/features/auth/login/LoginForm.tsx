import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Mail, Lock, Loader2 } from "lucide-react";

export interface LoginFormProps {
  values: { email: string; password: string };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  fieldErrors: { [k: string]: string };
  onSubmit: (e: React.FormEvent) => void;
  loading?: boolean;
  error?: string | null;
}

export function LoginForm({
  values,
  onChange,
  onBlur,
  fieldErrors,
  onSubmit,
  loading,
  error,
}: LoginFormProps) {
  return (
    <form className="grid gap-4" onSubmit={onSubmit} noValidate>
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground">
            <Mail size={16} />
          </span>
          <Input
            id="email"
            name="email"
            type="email"
            required
            autoFocus
            value={values.email}
            onChange={onChange}
            onBlur={onBlur}
            aria-invalid={!!fieldErrors.email}
            aria-describedby={fieldErrors.email ? "email-error" : undefined}
            className={
              fieldErrors.email
                ? "pl-8 border-destructive focus-visible:ring-destructive"
                : "pl-8"
            }
          />
        </div>
        {fieldErrors.email && (
          <span id="email-error" className="text-destructive text-xs">
            {fieldErrors.email}
          </span>
        )}
      </div>
      <div className="grid gap-2">
        <Label htmlFor="password">Senha</Label>
        <div className="relative">
          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground">
            <Lock size={16} />
          </span>
          <Input
            id="password"
            name="password"
            type="password"
            required
            minLength={6}
            value={values.password}
            onChange={onChange}
            onBlur={onBlur}
            aria-invalid={!!fieldErrors.password}
            aria-describedby={
              fieldErrors.password ? "password-error" : undefined
            }
            className={
              fieldErrors.password
                ? "pl-8 border-destructive focus-visible:ring-destructive"
                : "pl-8"
            }
          />
        </div>
        {fieldErrors.password && (
          <span id="password-error" className="text-destructive text-xs">
            {fieldErrors.password}
          </span>
        )}
      </div>
      {error && <div className="text-destructive text-sm">{error}</div>}
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? (
          <Loader2 className="animate-spin mr-2 inline" size={16} />
        ) : null}
        Entrar
      </Button>
      <div className="text-center mt-2">
        <a
          href="/auth/forgot"
          className="text-sm text-muted-foreground underline hover:text-primary"
        >
          Esqueceu sua senha?
        </a>
      </div>
    </form>
  );
}
