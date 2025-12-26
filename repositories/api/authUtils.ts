import { auth } from '@/repositories/firebase/config';

/**
 * 現在ログイン中のユーザーの認証トークンを取得する
 * @throws {Error} ユーザーが認証されていない場合
 * @returns {Promise<string>} Firebase Auth IDトークン
 */
export async function getAuthToken(): Promise<string> {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('認証されていません');
  }
  return await user.getIdToken();
}
