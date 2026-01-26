'use client';

import { Button } from '@/components/common/Button';
import { useLogin } from '@/hooks/auth/useLogin';

export default function LoginPage() {
  const {
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
  } = useLogin();

  return (
    <div className="container mx-auto px-4 py-8">
      <img
        src="/images/logo.png"
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

            {(upgradeValidationError || upgradeError || upgradeMessage) && (
              <div
                className={`rounded-md border px-3 py-2 text-sm ${
                  upgradeValidationError || upgradeError
                    ? 'border-red-200 bg-red-50 text-red-700'
                    : 'border-green-200 bg-green-50 text-green-700'
                }`}
              >
                {upgradeValidationError || upgradeError || upgradeMessage}
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
