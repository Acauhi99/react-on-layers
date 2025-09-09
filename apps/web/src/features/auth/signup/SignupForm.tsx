import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { User, Calendar, Mail, Lock, Loader2 } from "lucide-react";

export interface SignupFormProps {
  values: {
    name: string;
    birthdate: string;
    email: string;
    password: string;
    confirmPassword: string;
    acceptedTerms: boolean;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCheckedChange: (checked: boolean) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  fieldErrors: { [k: string]: string };
  onSubmit: (e: React.FormEvent) => void;
  loading?: boolean;
  error?: string | null;
}

export function SignupForm({
  values,
  onChange,
  onCheckedChange,
  onBlur,
  fieldErrors,
  onSubmit,
  loading,
  error,
}: SignupFormProps) {
  return (
    <form className="grid gap-4" onSubmit={onSubmit} noValidate>
      <div className="grid gap-2">
        <Label htmlFor="name">Nome</Label>
        <div className="relative">
          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground">
            <User size={16} />
          </span>
          <Input
            id="name"
            name="name"
            type="text"
            required
            value={values.name}
            onChange={onChange}
            onBlur={onBlur}
            aria-invalid={!!fieldErrors.name}
            aria-describedby={fieldErrors.name ? "name-error" : undefined}
            className={
              fieldErrors.name
                ? "pl-8 border-destructive focus-visible:ring-destructive"
                : "pl-8"
            }
          />
        </div>
        {fieldErrors.name && (
          <span id="name-error" className="text-destructive text-xs">
            {fieldErrors.name}
          </span>
        )}
      </div>
      <div className="grid gap-2">
        <Label htmlFor="birthdate">Data de nascimento</Label>
        <div className="relative">
          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground">
            <Calendar size={16} />
          </span>
          <Input
            id="birthdate"
            name="birthdate"
            type="date"
            required
            value={values.birthdate}
            onChange={onChange}
            onBlur={onBlur}
            aria-invalid={!!fieldErrors.birthdate}
            aria-describedby={
              fieldErrors.birthdate ? "birthdate-error" : undefined
            }
            className={
              fieldErrors.birthdate
                ? "pl-8 border-destructive focus-visible:ring-destructive"
                : "pl-8"
            }
          />
        </div>
        {fieldErrors.birthdate && (
          <span id="birthdate-error" className="text-destructive text-xs">
            {fieldErrors.birthdate}
          </span>
        )}
      </div>
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
      <div className="grid gap-2">
        <Label htmlFor="confirmPassword">Confirme a senha</Label>
        <div className="relative">
          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground">
            <Lock size={16} />
          </span>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            minLength={6}
            value={values.confirmPassword}
            onChange={onChange}
            onBlur={onBlur}
            aria-invalid={!!fieldErrors.confirmPassword}
            aria-describedby={
              fieldErrors.confirmPassword ? "confirmPassword-error" : undefined
            }
            className={
              fieldErrors.confirmPassword
                ? "pl-8 border-destructive focus-visible:ring-destructive"
                : "pl-8"
            }
          />
        </div>
        {fieldErrors.confirmPassword && (
          <span id="confirmPassword-error" className="text-destructive text-xs">
            {fieldErrors.confirmPassword}
          </span>
        )}
      </div>
      <div className="flex items-center gap-2">
        <Checkbox
          id="terms"
          name="acceptedTerms"
          checked={values.acceptedTerms}
          onCheckedChange={onCheckedChange}
          required
        />
        <Label htmlFor="terms" className="cursor-pointer leading-snug">
          Eu li e aceito os{" "}
          <a
            href="https://www.seusite.com/termos"
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-primary"
          >
            Termos de Uso
          </a>
        </Label>
      </div>
      {fieldErrors.acceptedTerms && (
        <span className="text-destructive text-xs">
          {fieldErrors.acceptedTerms}
        </span>
      )}
      {error && <div className="text-destructive text-sm">{error}</div>}
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? (
          <Loader2 className="animate-spin mr-2 inline" size={16} />
        ) : null}
        Cadastrar
      </Button>
    </form>
  );
}
