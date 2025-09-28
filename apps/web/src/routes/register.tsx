import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { RegisterForm } from "@/features/auth/register-form";
import { useAuthStore } from "@/stores/auth.store";

export const Route = createFileRoute("/register")({
  beforeLoad: () => {
    const { isAuthenticated } = useAuthStore.getState();
    if (isAuthenticated) {
      throw redirect({ to: "/" });
    }
  },
  component: RegisterPage,
});

function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4">
      <div className="w-full max-w-md space-y-6">
        <RegisterForm />
        <div className="text-center text-sm text-muted-foreground">
          Já tem uma conta?{" "}
          <Link
            to="/login"
            className="text-primary hover:underline font-medium"
          >
            Fazer login
          </Link>
        </div>
      </div>
    </div>
  );
}
