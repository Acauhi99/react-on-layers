import { useMutation } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/auth.store";
import { AuthService } from "@/services/auth.service";

export function useLogin() {
  const router = useRouter();
  const { login } = useAuthStore();

  return useMutation({
    mutationFn: AuthService.login,
    onSuccess: (data) => {
      login(data.token);
      toast.success("Login realizado com sucesso!");
      router.navigate({ to: "/" });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}

export function useRegister() {
  const router = useRouter();
  const { login } = useAuthStore();

  return useMutation({
    mutationFn: AuthService.register,
    onSuccess: (data) => {
      login(data.token);
      toast.success("Conta criada com sucesso!");
      router.navigate({ to: "/" });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}
