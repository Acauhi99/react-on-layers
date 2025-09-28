import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { LoginForm } from "@/features/auth/login-form";
import { useAuthStore } from "@/stores/auth.store";

export const Route = createFileRoute("/login")({
  beforeLoad: () => {
    const { isAuthenticated } = useAuthStore.getState();
    if (isAuthenticated) {
      throw redirect({ to: "/" });
    }
  },
  component: LoginPage,
});

function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4">
      <div className="w-full max-w-md space-y-6">
        <LoginForm />
        <div className="text-center text-sm text-muted-foreground">
          Não tem uma conta?{" "}
          <Link
            to="/register"
            className="text-primary hover:underline font-medium"
          >
            Criar conta gratuita
          </Link>
        </div>
      </div>
    </div>
  );
}
