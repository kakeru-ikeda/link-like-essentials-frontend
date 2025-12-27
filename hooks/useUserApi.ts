import { useApiBase } from './useApiBase';
import { userService } from '@/services/userService';
import type { UserProfile, UserProfileInput } from '@/models/User';

export interface UseUserApiReturn {
  /** 自分のプロフィールを取得 */
  getMyProfile: () => Promise<UserProfile>;
  /** プロフィールを作成 */
  createProfile: (input: UserProfileInput) => Promise<UserProfile>;
  /** プロフィールを更新 */
  updateProfile: (input: UserProfileInput) => Promise<UserProfile>;
  /** アバター画像を削除 */
  deleteAvatar: () => Promise<void>;
  /** ユーザーを削除 */
  deleteUser: () => Promise<void>;
  /** ローディング状態 */
  isLoading: boolean;
  /** エラーメッセージ */
  error: string | null;
  /** 状態をリセット */
  reset: () => void;
}

/**
 * User API操作用カスタムフック
 * 
 * useApiBaseを使用して共通のエラーハンドリングとローディング管理を提供
 * ビジネスロジックはuserServiceに委譲
 */
export const useUserApi = (): UseUserApiReturn => {
  const { execute, isLoading, error, reset } = useApiBase();

  const getMyProfile = () =>
    execute(() => userService.getMyProfile(), {
      errorMessage: 'プロフィールの取得に失敗しました',
    });

  const createProfile = (input: UserProfileInput) =>
    execute(() => userService.createProfile(input), {
      errorMessage: 'プロフィールの作成に失敗しました',
    });

  const updateProfile = (input: UserProfileInput) =>
    execute(() => userService.updateProfile(input), {
      errorMessage: 'プロフィールの更新に失敗しました',
    });

  const deleteAvatar = () =>
    execute(() => userService.deleteAvatar(), {
      errorMessage: 'アバター画像の削除に失敗しました',
    });

  const deleteUser = () =>
    execute(() => userService.deleteUser(), {
      errorMessage: 'ユーザーの削除に失敗しました',
    });

  return {
    getMyProfile,
    createProfile,
    updateProfile,
    deleteAvatar,
    deleteUser,
    isLoading,
    error,
    reset,
  };
};
