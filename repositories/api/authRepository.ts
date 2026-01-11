import { USER_API_ENDPOINT } from '@/config/api';
import { getAuthToken } from './authUtils';
import type { UserProfile } from '@/models/User';
import { UserRole } from '@/models/enums';

export interface UpgradeAnonymousRequest {
  email: string;
  password: string;
  displayName?: string;
}

export interface UpgradeAnonymousResponse {
  user: UserProfile;
  verificationLink?: string;
}

export const authRepository = {
  async upgradeAnonymousToEmail(
    payload: UpgradeAnonymousRequest
  ): Promise<UpgradeAnonymousResponse> {
    const token = await getAuthToken();
    const response = await fetch(`${USER_API_ENDPOINT}/auth/upgrade/email`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error?.message || 'メールユーザーへの昇格に失敗しました');
    }

    const data = (await response.json()) as UpgradeAnonymousResponse;
    return {
      user: data.user,
      verificationLink: data.verificationLink,
    };
  },
};
