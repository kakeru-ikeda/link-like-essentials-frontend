import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { UserProfile } from '@/models/User';

interface UserProfileState {
  profile: UserProfile | null;
  setProfile: (profile: UserProfile | null) => void;
  clearProfile: () => void;
}

export const useUserProfileStore = create<UserProfileState>()(
  immer((set) => ({
    profile: null,
    setProfile: (profile) =>
      set((state) => {
        state.profile = profile;
      }),
    clearProfile: () =>
      set((state) => {
        state.profile = null;
      }),
  }))
);
