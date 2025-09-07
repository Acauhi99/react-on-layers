export type AuthResult =
  | { success: true }
  | { success: false; message: string };

export interface AuthApi {
  login(email: string, password: string): Promise<AuthResult>;
  signup(email: string, password: string): Promise<AuthResult>;
}

export function useAuth(): AuthApi {
  // Mock implementation
  return {
    async login(email, password) {
      await new Promise((r) => setTimeout(r, 800));
      if (email === "admin@example.com" && password === "123456") {
        return { success: true };
      }
      return { success: false, message: "Credenciais inválidas" };
    },
    async signup(email, password) {
      await new Promise((r) => setTimeout(r, 800));
      if (email && password.length >= 6) {
        return { success: true };
      }
      return { success: false, message: "Dados inválidos" };
    },
  };
}
