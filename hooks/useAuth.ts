import { useAuthStore } from '@/store/authStore';

export const useAuth = () => {
  const { user, isAuthenticated, role, logout } = useAuthStore();

  return {
    user,
    isAuthenticated,
    role,
    logout,
  };
};
