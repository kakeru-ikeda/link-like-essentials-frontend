import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AwakeStateStore {
  awakeStates: Record<string, boolean>; // cardId -> isAwakeAfter (デフォルト: true)
  setAwakeState: (cardId: string, isAwakeAfter: boolean) => void;
  clearAwakeState: (cardId: string) => void;
}

export const useAwakeStateStore = create<AwakeStateStore>()(
  persist(
    (set) => ({
      awakeStates: {},
      setAwakeState: (cardId, isAwakeAfter) =>
        set((state) => ({
          awakeStates: { ...state.awakeStates, [cardId]: isAwakeAfter },
        })),
      clearAwakeState: (cardId) =>
        set((state) => {
          const { [cardId]: _, ...rest } = state.awakeStates;
          return { awakeStates: rest };
        }),
    }),
    {
      name: 'awake-state-storage',
    }
  )
);
