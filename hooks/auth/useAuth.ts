'use client';

import { useCallback } from 'react';
import { authService } from '@/services/auth/authService';
import { useAuthStore } from '@/store/authStore';
import { useUserProfileStore } from '@/store/userProfileStore';
import { UserRole } from '@/models/shared/enums';
import { logLogin } from '@/services/infrastructure/analyticsService';

export const useAuth = () => {
  const {
    user,
    isAuthenticated,
    role,
    logout: resetAuthState,
    setUser,
    setToken,
    setRole,
  } = useAuthStore();
  const { clearProfile } = useUserProfileStore();

  const signOut = useCallback(async () => {
    await authService.signOutUser();
    resetAuthState();
    clearProfile();
  }, [clearProfile, resetAuthState]);

  const signInWithEmail = useCallback(
    async (email: string, password: string) => {
      const { user: signedInUser, token } = await authService.signInWithEmail(email, password);
      setUser(signedInUser);
      setToken(token);
      const profile = await authService.fetchOrCreateProfile();
      const role = profile.role ?? UserRole.ANONYMOUS;
      setRole(role);
      logLogin('email');
      return { user: signedInUser, token, role, profile };
    },
    [setRole, setToken, setUser]
  );

  return {
    user,
    isAuthenticated,
    role,
    signOut,
    resetAuthState,
    signInWithEmail,
    setRole,
  };
};
