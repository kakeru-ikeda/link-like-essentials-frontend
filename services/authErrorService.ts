import { FirebaseError } from 'firebase/app';

export const authErrorService = {
  mapEmailAuthErrorMessage(error: unknown): string {
    if (error instanceof FirebaseError) {
      switch (error.code) {
        case 'auth/invalid-credential':
        case 'auth/wrong-password':
        case 'auth/user-not-found':
          return 'メールアドレスまたはパスワードが正しくありません。';
        case 'auth/too-many-requests':
          return '試行回数が多すぎます。しばらく時間をおいて再度お試しください。';
        case 'auth/invalid-email':
          return 'メールアドレスの形式が正しくありません。';
        default:
          return 'メールログインに失敗しました。時間をおいて再度お試しください。';
      }
    }

    return 'メールログインに失敗しました。時間をおいて再度お試しください。';
  },
};
