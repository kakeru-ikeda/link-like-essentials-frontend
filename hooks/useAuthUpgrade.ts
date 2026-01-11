'use client';

import { useCallback } from 'react';
import { authService } from '@/services/authService';
import { useApiBase } from './useApiBase';
import { useAuthStore } from '@/store/authStore';
import { useUserProfileStore } from '@/store/userProfileStore';
import type { UpgradeAnonymousRequest, UpgradeAnonymousResponse } from '@/repositories/api/authRepository';
import { UserRole } from '@/models/enums';

export const useAuthUpgrade = () => {
  const { execute, isLoading, error, reset } = useApiBase();
  const { setUser, setToken, setRole } = useAuthStore();
  const { setProfile } = useUserProfileStore();

  const upgrade = useCallback(
    async (payload: UpgradeAnonymousRequest): Promise<UpgradeAnonymousResponse> => {
      const result = await execute(() => authService.upgradeAnonymousToEmail(payload), {
        errorMessage: 'メールユーザーへの昇格に失敗しました',
      });

      setUser(result.user);
      setToken(result.token);
      setRole(result.role ?? UserRole.EMAIL);
      setProfile(result.profile);

      return result.upgradeResult;
    },
    [execute, setProfile, setRole, setToken, setUser]
  );

  return {
    upgrade,
    isLoading,
    error,
    reset,
  };
};
