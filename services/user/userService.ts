import { UserProfile, UserProfileInput } from '@/models/user/User';
import { userRepository } from '@/repositories/api/userRepository';

/**
 * ユーザープロフィール管理サービス
 * ビジネスロジックを担当
 */
export const userService = {
  /**
   * 自分のプロフィールを取得
   */
  async getMyProfile(): Promise<UserProfile> {
    return await userRepository.getMyProfile();
  },

  /**
   * プロフィールを作成
   */
  async createProfile(input: UserProfileInput): Promise<UserProfile> {
    return await userRepository.createProfile(input);
  },

  /**
   * プロフィールを更新
   */
  async updateProfile(input: UserProfileInput): Promise<UserProfile> {
    return await userRepository.updateProfile(input);
  },

  /**
   * アバター画像を削除
   */
  async deleteAvatar(): Promise<void> {
    await userRepository.deleteAvatar();
  },

  /**
   * ユーザーを削除
   */
  async deleteUser(): Promise<void> {
    await userRepository.deleteUser();
  },
};
