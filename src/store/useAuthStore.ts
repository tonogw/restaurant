import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  setToken: (tojen: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      isAuthenticated: false,
      setToken: (token) => {
        if (token) {
          localStorage.setItem("token", token);
          set({ token, isAuthenticated: true });
        } else {
          localStorage.removeItem("token");
          set({ token: null, isAuthenticated: false });
        }
      },
      logout: () => {
        localStorage.removeItem("token");
        set({ token: null, isAuthenticated: false });
        window.location.href = "/auth/login";
      },
    }),
    {
      name: "foody-auth-storage",
    },
  ),
);
