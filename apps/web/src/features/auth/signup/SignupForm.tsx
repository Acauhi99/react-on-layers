import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

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
  onSubmit: (e: React.FormEvent) => void;
  loading?: boolean;
  error?: string | null;
}

export function SignupForm({
  values,
  onChange,
  onCheckedChange,
  onSubmit,
  loading,
  error,
}: SignupFormProps) {
  return (
    <form className="grid gap-4" onSubmit={onSubmit}>
      <div className="grid gap-2">
        <Label htmlFor="name">Nome</Label>
        <Input
          id="name"
          name="name"
          type="text"
          required
          value={values.name}
          onChange={onChange}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="birthdate">Data de nascimento</Label>
        <Input
          id="birthdate"
          name="birthdate"
          type="date"
          required
          value={values.birthdate}
          onChange={onChange}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          value={values.email}
          onChange={onChange}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="password">Senha</Label>
        <Input
          id="password"
          name="password"
          type="password"
          required
          minLength={6}
          value={values.password}
          onChange={onChange}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="confirmPassword">Confirme a senha</Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          required
          minLength={6}
          value={values.confirmPassword}
          onChange={onChange}
        />
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
      {error && <div className="text-destructive text-sm">{error}</div>}
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Cadastrando..." : "Cadastrar"}
      </Button>
    </form>
  );
}
