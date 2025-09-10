import { createFileRoute, redirect } from "@tanstack/react-router";
import { useAuthStore } from "@/features/auth/useAuthStore";
import { HomePage } from "@/features/home/HomePage";

export const Route = createFileRoute("/")({
  loader: () => {
    const isAuthenticated = useAuthStore.getState().isAuthenticated;
    if (!isAuthenticated) {
      throw redirect({ to: "/auth" });
    }
  },
  component: HomePage,
});
