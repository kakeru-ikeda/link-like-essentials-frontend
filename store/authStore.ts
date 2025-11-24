import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { User } from 'firebase/auth';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  immer((set) => ({
    user: null,
    token: null,
    isAuthenticated: false,

    setUser: (user) =>
      set((state) => {
        state.user = user;
        state.isAuthenticated = !!user;
      }),

    setToken: (token) =>
      set((state) => {
        state.token = token;
      }),

    logout: () =>
      set((state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      }),
  }))
);
