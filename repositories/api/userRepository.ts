import {
  UserProfile,
  UserProfileInput,
  AvatarUploadResponse,
} from '@/models/User';
import { USER_API_ENDPOINT } from '@/constants/apiEndpoints';
import { auth } from '@/repositories/firebase/config';

async function getAuthToken(): Promise<string> {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('認証されていません');
  }
  return await user.getIdToken();
}

export const userRepository = {
  /**
   * 自分のプロフィールを取得する
   * GET /users/me
   */
  async getMyProfile(): Promise<UserProfile> {
    const token = await getAuthToken();
    const response = await fetch(`${USER_API_ENDPOINT}/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(
        error.error?.message || 'プロフィールの取得に失敗しました'
      );
    }

    const data = await response.json();
    return data;
  },

  /**
   * プロフィールを作成する
   * POST /users/me
   */
  async createProfile(
    profileInput: UserProfileInput
  ): Promise<UserProfile> {
    const token = await getAuthToken();
    const response = await fetch(`${USER_API_ENDPOINT}/users/me`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profileInput),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(
        error.error?.message || 'プロフィールの作成に失敗しました'
      );
    }

    const data = await response.json();
    return data;
  },

  /**
   * プロフィールを更新する
   * PUT /users/me
   */
  async updateProfile(
    profileInput: UserProfileInput
  ): Promise<UserProfile> {
    const token = await getAuthToken();
    const response = await fetch(`${USER_API_ENDPOINT}/users/me`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profileInput),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(
        error.error?.message || 'プロフィールの更新に失敗しました'
      );
    }

    const data = await response.json();
    return data;
  },

  /**
   * アバター画像をアップロードする
   * POST /users/me/avatar
   * @param file - アップロードする画像ファイル (最大5MB, JPEG/PNG/WebP)
   */
  async uploadAvatar(file: File): Promise<AvatarUploadResponse> {
    const token = await getAuthToken();
    const formData = new FormData();
    formData.append('avatar', file);

    const response = await fetch(`${USER_API_ENDPOINT}/users/me/avatar`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(
        error.error?.message || 'アバター画像のアップロードに失敗しました'
      );
    }

    const data = await response.json();
    return data;
  },

  /**
   * アバター画像を削除する
   * DELETE /users/me/avatar
   */
  async deleteAvatar(): Promise<void> {
    const token = await getAuthToken();
    const response = await fetch(`${USER_API_ENDPOINT}/users/me/avatar`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(
        error.error?.message || 'アバター画像の削除に失敗しました'
      );
    }
  },

  /**
   * ユーザーを削除する
   * DELETE /users/me
   */
  async deleteUser(): Promise<void> {
    const token = await getAuthToken();
    const response = await fetch(`${USER_API_ENDPOINT}/users/me`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(
        error.error?.message || 'ユーザーの削除に失敗しました'
      );
    }
  },
};
