import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { User } from 'firebase/auth';
import { UserRole } from '@/models/enums';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  role: UserRole | null;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setRole: (role: UserRole | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  immer((set) => ({
    user: null,
    token: null,
    isAuthenticated: false,
    role: null,

    setUser: (user) =>
      set((state) => {
        state.user = user;
        state.isAuthenticated = !!user;
      }),

    setToken: (token) =>
      set((state) => {
        state.token = token;
      }),

    setRole: (role) =>
      set((state) => {
        state.role = role;
      }),

    logout: () =>
      set((state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.role = null;
      }),
  }))
);
