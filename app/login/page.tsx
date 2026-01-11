'use client';

import { FormEvent, useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmail } from '@/repositories/firebase/auth';
import { useAuthStore } from '@/store/authStore';
import { userService } from '@/services/userService';
import { useUserProfileStore } from '@/store/userProfileStore';
import { useAuthUpgrade } from '@/hooks/useAuthUpgrade';
import { Button } from '@/components/common/Button';
import { UserRole } from '@/models/enums';
import { authErrorService } from '@/services/authErrorService';

export default function LoginPage() {
  const router = useRouter();
  const { setUser, setToken, setRole } = useAuthStore();
  const { setProfile } = useUserProfileStore();
  const { upgrade, isLoading: isUpgrading, error: upgradeError, reset: resetUpgrade } = useAuthUpgrade();

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [upgradeEmail, setUpgradeEmail] = useState('');
  const [upgradePassword, setUpgradePassword] = useState('');
  const [upgradeDisplayName, setUpgradeDisplayName] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [upgradeMessage, setUpgradeMessage] = useState<string | null>(null);

  const fetchAndStoreProfile = useCallback(async () => {
    try {
      const profile = await userService.getMyProfile();
      setRole(profile.role ?? UserRole.ANONYMOUS);
      setProfile(profile);
      return profile;
    } catch (error) {
      // プロフィール未作成の場合はゲストで作成（idempotent）
      const created = await userService.createProfile({ displayName: 'ゲスト' });
      setRole(created.role ?? UserRole.ANONYMOUS);
      setProfile(created);
      return created;
    }
  }, [setProfile, setRole]);

  const handleLogin = useCallback(
    async (event: FormEvent) => {
      event.preventDefault();
      setLoginError(null);
      setUpgradeMessage(null);
      resetUpgrade();
      try {
        setIsLoggingIn(true);
        const user = await signInWithEmail(loginEmail, loginPassword);
        const token = await user.getIdToken(true);
        setUser(user);
        setToken(token);
        await fetchAndStoreProfile();
        router.push('/mypage');
      } catch (error) {
        setLoginError(authErrorService.mapLoginErrorMessage(error));
      } finally {
        setIsLoggingIn(false);
      }
    },
    [fetchAndStoreProfile, loginEmail, loginPassword, resetUpgrade, router, setToken, setUser]
  );

  const handleUpgrade = useCallback(
    async (event: FormEvent) => {
      event.preventDefault();
      setLoginError(null);
      setUpgradeMessage(null);
      try {
        const result = await upgrade({
          email: upgradeEmail,
          password: upgradePassword,
          displayName: upgradeDisplayName || undefined,
        });
        setProfile(result.user);
        setUpgradeMessage('メールアドレスを登録しました。');
        router.push('/mypage');
      } catch (error) {
        const message = error instanceof Error ? error.message : 'メール登録に失敗しました';
        setLoginError(message);
      }
    },
    [router, setProfile, upgrade, upgradeDisplayName, upgradeEmail, upgradePassword]
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <img
        src="images/logo.png"
        alt="logo"
        className="mx-auto my-10 h-32 w-auto"
      />
      <div className="max-w-3xl mx-auto grid gap-8 md:grid-cols-2">
        <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900">メールでログイン</h1>
          <p className="mt-2 text-sm text-gray-600">既にメール登録済みの方はこちらからログインしてください。</p>

          <form className="mt-4 space-y-4" onSubmit={handleLogin}>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">メールアドレス</label>
              <input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none text-black"
                required
                autoComplete="email"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">パスワード</label>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none text-black"
                required
                minLength={6}
                autoComplete="current-password"
              />
            </div>

            {loginError && (
              <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {loginError}
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600"
              disabled={isLoggingIn}
            >
              {isLoggingIn ? 'ログイン中...' : 'ログイン'}
            </Button>
          </form>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900">メール登録</h2>
          <p className="mt-2 text-sm text-gray-600">現在のゲストユーザーにメールアドレスを紐付けて永続化します。</p>

          <form className="mt-4 space-y-4" onSubmit={handleUpgrade}>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">メールアドレス</label>
              <input
                type="email"
                value={upgradeEmail}
                onChange={(e) => setUpgradeEmail(e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none text-black"
                required
                autoComplete="email"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">パスワード</label>
              <input
                type="password"
                value={upgradePassword}
                onChange={(e) => setUpgradePassword(e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none text-black"
                required
                minLength={6}
                autoComplete="new-password"
              />
            </div>

            {(upgradeError || upgradeMessage) && (
              <div
                className={`rounded-md border px-3 py-2 text-sm ${
                  upgradeError
                    ? 'border-red-200 bg-red-50 text-red-700'
                    : 'border-green-200 bg-green-50 text-green-700'
                }`}
              >
                {upgradeError || upgradeMessage}
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-emerald-500 hover:bg-emerald-600"
              disabled={isUpgrading}
            >
              {isUpgrading ? '登録中...' : 'メールを登録する'}
            </Button>
          </form>
        </section>
      </div>
    </div>
  );
}
