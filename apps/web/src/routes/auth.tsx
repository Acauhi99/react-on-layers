import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/auth")({
  component: AuthPage,
});

function mockLoginApi(email: string, password: string) {
  return new Promise<{ success: boolean; message?: string }>((resolve) => {
    setTimeout(() => {
      if (email === "admin@example.com" && password === "123456") {
        resolve({ success: true });
      } else {
        resolve({ success: false, message: "Credenciais inválidas" });
      }
    }, 800);
  });
}

function mockRegisterApi(email: string, password: string) {
  return new Promise<{ success: boolean; message?: string }>((resolve) => {
    setTimeout(() => {
      if (email && password.length >= 6) {
        resolve({ success: true });
      } else {
        resolve({ success: false, message: "Dados inválidos" });
      }
    }, 800);
  });
}

function AuthPage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    let res;
    if (mode === "login") {
      res = await mockLoginApi(email, password);
    } else {
      res = await mockRegisterApi(email, password);
    }
    setLoading(false);
    if (res.success) {
      navigate({ to: "/" });
    } else {
      setError(res.message || "Erro");
    }
  };

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>{mode === "login" ? "Login" : "Cadastro"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4" onSubmit={handleSubmit}>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            {error && <div className="text-destructive text-sm">{error}</div>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading
                ? mode === "login"
                  ? "Entrando..."
                  : "Cadastrando..."
                : mode === "login"
                ? "Entrar"
                : "Cadastrar"}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            {mode === "login" ? (
              <>
                Não tem conta?{" "}
                <button
                  type="button"
                  className="text-primary underline"
                  onClick={() => {
                    setMode("register");
                    setError(null);
                  }}
                >
                  Cadastre-se
                </button>
              </>
            ) : (
              <>
                Já tem conta?{" "}
                <button
                  type="button"
                  className="text-primary underline"
                  onClick={() => {
                    setMode("login");
                    setError(null);
                  }}
                >
                  Entrar
                </button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
