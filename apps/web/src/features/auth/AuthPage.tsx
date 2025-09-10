import { useState } from "react";
import { useAuth } from "./useAuth";
import { LoginFormContainer } from "./login/LoginFormContainer";
import { SignupFormContainer } from "./signup/SignupFormContainer";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useNavigate } from "@tanstack/react-router";
import { useAuthStore } from "@/features/auth/useAuthStore";

export function AuthPage() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const auth = useAuth();
  const navigate = useNavigate();

  const handleLogin = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    setLoading(true);
    setError(null);
    const res = await auth.login(email, password);
    setLoading(false);

    if (res.success) {
      useAuthStore.getState().login();
      navigate({ to: "/" });
    } else {
      setError(res.message);
    }
  };

  const handleSignup = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    setLoading(true);
    setError(null);
    const res = await auth.signup(email, password);
    setLoading(false);

    if (res.success) {
      navigate({ to: "/" });
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>{mode === "login" ? "Login" : "Cadastro"}</CardTitle>
        </CardHeader>
        <CardContent>
          {mode === "login" ? (
            <LoginFormContainer
              onSubmit={handleLogin}
              loading={loading}
              error={error}
            />
          ) : (
            <SignupFormContainer
              onSubmit={handleSignup}
              loading={loading}
              error={error}
            />
          )}
          <div className="mt-4 text-center text-sm">
            {mode === "login" ? (
              <>
                Não tem conta?{" "}
                <button
                  type="button"
                  className="text-sm text-muted-foreground underline hover:text-primary cursor-pointer"
                  onClick={() => {
                    setMode("signup");
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
                  className="text-sm text-muted-foreground underline hover:text-primary cursor-pointer"
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
