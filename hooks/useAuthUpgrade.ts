'use client';

import { useCallback } from 'react';
import { authService } from '@/services/authService';
import { useApiBase } from './useApiBase';
import { useAuthStore } from '@/store/authStore';
import type { UpgradeAnonymousRequest, UpgradeAnonymousResponse } from '@/repositories/api/authRepository';
import { UserRole } from '@/models/enums';
import { signInWithEmail } from '@/repositories/firebase/auth';

export const useAuthUpgrade = () => {
  const { execute, isLoading, error, reset } = useApiBase();
  const { setUser, setToken, setRole } = useAuthStore();

  const upgrade = useCallback(
    async (payload: UpgradeAnonymousRequest): Promise<UpgradeAnonymousResponse> => {
      const result = await execute(() => authService.upgradeAnonymousToEmail(payload), {
        errorMessage: 'メールユーザーへの昇格に失敗しました',
      });

      // 昇格後に新しい資格情報で再サインインしてトークンを更新する
      const emailUser = await signInWithEmail(payload.email, payload.password);
      const token = await emailUser.getIdToken(true);
      setUser(emailUser);
      setToken(token);
      setRole(result.user.role ?? UserRole.EMAIL);

      return result;
    },
    [execute, setRole, setToken, setUser]
  );

  return {
    upgrade,
    isLoading,
    error,
    reset,
  };
};
