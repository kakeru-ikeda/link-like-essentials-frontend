import './env.ts';

/**
 * Firebase REST API を使って匿名サインインし、IDトークンを返す。
 * `firebase` SDK に依存せず、追加パッケージ不要で動作する。
 * 必要な環境変数: NEXT_PUBLIC_FIREBASE_API_KEY
 */
export async function getFirebaseIdToken(): Promise<string> {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  if (!apiKey) {
    throw new Error('環境変数 NEXT_PUBLIC_FIREBASE_API_KEY が設定されていません');
  }

  const res = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ returnSecureToken: true }),
    }
  );

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Firebase 匿名認証に失敗しました: ${res.status} ${body}`);
  }

  const data = (await res.json()) as { idToken?: string };
  if (!data.idToken) {
    throw new Error('Firebase からトークンを取得できませんでした');
  }

  return data.idToken;
}
