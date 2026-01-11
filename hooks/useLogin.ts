'use client';

import { FormEvent, useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useAuthUpgrade } from '@/hooks/useAuthUpgrade';
import { authErrorService } from '@/services/authErrorService';
import { useUserProfileStore } from '@/store/userProfileStore';

const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

export const useLogin = () => {
  const router = useRouter();
  const { signInWithEmail } = useAuth();
  const { setProfile } = useUserProfileStore();
  const { upgrade, isLoading: isUpgrading, error: upgradeError, reset: resetUpgrade } = useAuthUpgrade();

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [upgradeEmail, setUpgradeEmail] = useState('');
  const [upgradePassword, setUpgradePassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [upgradeValidationError, setUpgradeValidationError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [upgradeMessage, setUpgradeMessage] = useState<string | null>(null);

  const handleLogin = useCallback(
    async (event: FormEvent) => {
      event.preventDefault();
      setLoginError(null);
      setUpgradeMessage(null);
      resetUpgrade();
      if (!isValidEmail(loginEmail)) {
        setLoginError('メールアドレスの形式が正しくありません。');
        return;
      }
      try {
        setIsLoggingIn(true);
        const { profile } = await signInWithEmail(loginEmail, loginPassword);
        setProfile(profile);
        router.push('/mypage');
      } catch (error) {
        setLoginError(authErrorService.mapEmailAuthErrorMessage(error));
      } finally {
        setIsLoggingIn(false);
      }
    },
    [loginEmail, loginPassword, resetUpgrade, router, setProfile, signInWithEmail]
  );

  const handleUpgrade = useCallback(
    async (event: FormEvent) => {
      event.preventDefault();
      setLoginError(null);
      setUpgradeMessage(null);
      setUpgradeValidationError(null);
      if (!isValidEmail(upgradeEmail)) {
        setUpgradeValidationError('メールアドレスの形式が正しくありません。');
        return;
      }
      try {
        const result = await upgrade({
          email: upgradeEmail,
          password: upgradePassword,
        });
        setProfile(result.user);
        setUpgradeMessage('メールアドレスを登録しました。');
        router.push('/mypage');
      } catch (error) {
        // useAuthUpgrade が upgradeError をセットするため、ここでは個別のエラーステートを持たない
      }
    },
    [router, setProfile, upgrade, upgradeEmail, upgradePassword]
  );

  return {
    loginEmail,
    setLoginEmail,
    loginPassword,
    setLoginPassword,
    upgradeEmail,
    setUpgradeEmail,
    upgradePassword,
    setUpgradePassword,
    loginError,
    upgradeValidationError,
    upgradeMessage,
    upgradeError,
    isLoggingIn,
    isUpgrading,
    handleLogin,
    handleUpgrade,
  };
};
