/**
 * キャラクター選択フィルタリングサービス
 *
 * スロットに配置可能なキャラクターのみを表示するためのロジックを提供します。
 */

import { CHARACTERS } from '@/constants/characters';
import { canPlaceCardInSlot, getCharacterGeneration } from '@/constants/deckRules';
import { DECK_SLOT_MAPPING } from '@/constants/deckConfig';

/**
 * 指定されたスロットに配置可能なキャラクターのみをフィルタリング
 *
 * @param slotId - 配置先のスロットID
 * @returns 配置可能なキャラクター名の配列
 */
export function getSelectableCharactersForSlot(slotId: number | null): string[] {
  if (slotId === null) {
    // スロット未選択時は全キャラクター表示
    return [...CHARACTERS];
  }

  const slotMapping = DECK_SLOT_MAPPING.find((m) => m.slotId === slotId);
  if (!slotMapping) {
    return [...CHARACTERS];
  }

  const slotCharacter = slotMapping.characterName;
  const slotType = slotMapping.slotType;
  const slotGeneration = getCharacterGeneration(slotCharacter);

  // 各キャラクターのカードがスロットに配置可能かチェック
  const selectableCharacters = CHARACTERS.filter((characterName) => {
    // 基本チェック: レアリティなしで配置可能か
    const basicResult = canPlaceCardInSlot({ characterName }, slotId);
    if (basicResult.allowed) {
      return true;
    }

    // 102期生の追加チェック: LRカードが配置可能か
    const characterGeneration = getCharacterGeneration(characterName);
    if (characterGeneration === 102) {
      // 102期生LRは103期・104期のサイドに配置可能
      if (slotGeneration && [103, 104].includes(slotGeneration) && slotType === 'side') {
        return true;
      }
    }

    return false;
  });

  // スロットのキャラクターを先頭に配置
  return [
    slotCharacter,
    ...selectableCharacters.filter((char) => char !== slotCharacter),
  ];
}
