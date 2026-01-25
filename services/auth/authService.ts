import type { UpgradeAnonymousRequest, UpgradeAnonymousResponse } from '@/repositories/api/authRepository';
import { authRepository } from '@/repositories/api/authRepository';
import { signInWithEmail as signInWithEmailRepo, signOutUser as signOutUserRepo } from '@/repositories/firebase/auth';
import { userService } from '@/services/user/userService';
import type { UserProfile } from '@/models/user/User';
import { UserRole } from '@/models/shared/enums';

interface SignInResult {
  user: Awaited<ReturnType<typeof signInWithEmailRepo>>;
  token: string;
}

interface UpgradeResult {
  upgradeResult: UpgradeAnonymousResponse;
  user: Awaited<ReturnType<typeof signInWithEmailRepo>>;
  token: string;
  profile: UserProfile;
  role: UserRole;
}

export const authService = {
  async upgradeAnonymousToEmail(
    payload: UpgradeAnonymousRequest
  ): Promise<UpgradeResult> {
    const upgradeResult = await authRepository.upgradeAnonymousToEmail(payload);
    const { user, token } = await authService.signInWithEmail(payload.email, payload.password);
    const profile = await authService.fetchOrCreateProfile();
    const resolvedRole = profile.role ?? upgradeResult.user.role ?? UserRole.EMAIL;
    return { upgradeResult, user, token, profile, role: resolvedRole };
  },
  async signInWithEmail(email: string, password: string): Promise<SignInResult> {
    const user = await signInWithEmailRepo(email, password);
    const token = await user.getIdToken(true);
    return { user, token };
  },
  async fetchOrCreateProfile(): Promise<UserProfile> {
    try {
      return await userService.getMyProfile();
    } catch (error) {
      const status = (error as { status?: number })?.status;
      if (status === 404) {
        return await userService.createProfile({ displayName: 'ゲスト' });
      }
      throw error;
    }
  },
  async signOutUser() {
    await signOutUserRepo();
  },
};
