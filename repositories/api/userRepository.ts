import {
  UserProfile,
  UserProfileInput,
} from '@/models/User';
import { USER_API_ENDPOINT } from '@/config/api';
import { getAuthToken } from './authUtils';

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
    return data.user;
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
    return data.user ?? data;
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
    return data.user ?? data;
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
