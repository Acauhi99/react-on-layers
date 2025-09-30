import {
  createFileRoute,
  Link,
  redirect,
  useSearch,
} from "@tanstack/react-router";
import { LoginForm } from "@/features/auth/login-form";
import { RegisterForm } from "@/features/auth/register-form";
import { useAuthStore } from "@/stores/auth.store";
import { z } from "zod";

const authSearchSchema = z.object({
  mode: z.enum(["login", "register"]).optional().default("login"),
});

export const Route = createFileRoute("/auth")({
  validateSearch: authSearchSchema,
  beforeLoad: () => {
    const { isAuthenticated } = useAuthStore.getState();
    if (isAuthenticated) {
      throw redirect({ to: "/" });
    }
  },
  component: AuthPage,
});

function AuthPage() {
  const { mode } = useSearch({ from: "/auth" });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4">
      <div className="w-full max-w-md space-y-6">
        {mode === "register" ? <RegisterForm /> : <LoginForm />}
        <div className="text-center text-sm text-muted-foreground">
          {mode === "register" ? (
            <>
              Já tem uma conta?{" "}
              <Link
                to="/auth"
                search={{ mode: "login" }}
                className="text-primary hover:underline font-medium"
              >
                Fazer login
              </Link>
            </>
          ) : (
            <>
              Não tem uma conta?{" "}
              <Link
                to="/auth"
                search={{ mode: "register" }}
                className="text-primary hover:underline font-medium"
              >
                Criar conta gratuita
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
