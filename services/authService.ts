import type { UpgradeAnonymousRequest, UpgradeAnonymousResponse } from '@/repositories/api/authRepository';
import { authRepository } from '@/repositories/api/authRepository';

export const authService = {
  async upgradeAnonymousToEmail(
    payload: UpgradeAnonymousRequest
  ): Promise<UpgradeAnonymousResponse> {
    return await authRepository.upgradeAnonymousToEmail(payload);
  },
};
