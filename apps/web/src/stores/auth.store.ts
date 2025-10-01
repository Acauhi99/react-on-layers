import { create } from "zustand";
import { persist } from "zustand/middleware";
import { decodeJWT, isTokenExpired } from "@/lib/jwt";

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
  getUser: () => User | null;
  isTokenValid: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      isAuthenticated: false,

      login: (token: string) => {
        const payload = decodeJWT(token);
        if (!payload || isTokenExpired(token)) {
          throw new Error("Token inválido");
        }

        set({ token, isAuthenticated: true });
      },

      logout: () => {
        set({ token: null, isAuthenticated: false });
      },

      getUser: () => {
        const { token, isAuthenticated } = get();
        if (!token || isTokenExpired(token)) {
          if (isAuthenticated) {
            set({ token: null, isAuthenticated: false });
          }
          return null;
        }

        if (!isAuthenticated) {
          set({ isAuthenticated: true });
        }

        const payload = decodeJWT(token);
        return payload
          ? {
              id: payload.accountId,
              email: payload.email,
              name: payload.name,
            }
          : null;
      },

      isTokenValid: () => {
        const { token } = get();
        return token ? !isTokenExpired(token) : false;
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ token: state.token }),
    }
  )
);
