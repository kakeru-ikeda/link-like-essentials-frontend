import { useAwakeStateStore } from '@/store/awakeStateStore';

/**
 * 特定カードの覚醒状態と切り替え関数を返すフック
 * @param cardId カードID（undefined の場合は isAwakeAfter が常に true）
 */
export function useAwakeState(cardId: string | undefined) {
  const isAwakeAfter = useAwakeStateStore(
    (state) => (cardId ? (state.awakeStates[cardId] ?? true) : true)
  );
  const _setAwakeState = useAwakeStateStore((state) => state.setAwakeState);

  const setAwakeState = (val: boolean): void => {
    if (cardId) _setAwakeState(cardId, val);
  };

  return { isAwakeAfter, setAwakeState };
}

/**
 * 全カードの覚醒状態マップを返すフック
 */
export function useAwakeStates() {
  return useAwakeStateStore((state) => state.awakeStates);
}
