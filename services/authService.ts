import type { UpgradeAnonymousRequest, UpgradeAnonymousResponse } from '@/repositories/api/authRepository';
import { authRepository } from '@/repositories/api/authRepository';
import { signInWithEmail as signInWithEmailRepo, signOutUser as signOutUserRepo } from '@/repositories/firebase/auth';

export const authService = {
  async upgradeAnonymousToEmail(
    payload: UpgradeAnonymousRequest
  ): Promise<UpgradeAnonymousResponse> {
    return await authRepository.upgradeAnonymousToEmail(payload);
  },
  async signInWithEmail(email: string, password: string) {
    return await signInWithEmailRepo(email, password);
  },
  async signOutUser() {
    await signOutUserRepo();
  },
};
