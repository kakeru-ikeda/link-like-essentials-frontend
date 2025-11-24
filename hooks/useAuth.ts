import { useEffect } from 'react';
import { signInAnonymous, onAuthStateChange } from '@/repositories/firebase/auth';
import { useAuthStore } from '@/store/authStore';

export const useAuth = () => {
  const { user, isAuthenticated, setUser, setToken, logout } = useAuthStore();

  const initAuth = async (): Promise<void> => {
    try {
      const unsubscribe = onAuthStateChange(async (firebaseUser) => {
        if (firebaseUser) {
          setUser(firebaseUser);
          const token = await firebaseUser.getIdToken();
          setToken(token);
        } else {
          await signInAnonymous();
        }
      });

      return () => unsubscribe();
    } catch (error) {
      console.error('認証初期化エラー:', error);
    }
  };

  useEffect(() => {
    initAuth();
  }, []);

  return {
    user,
    isAuthenticated,
    logout,
    initAuth,
  };
};
