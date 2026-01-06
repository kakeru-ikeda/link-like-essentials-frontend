/**
 * キャラクター選択フィルタリングサービス
 *
 * スロットに配置可能なキャラクターのみを表示するためのロジックを提供します。
 */

import { CHARACTERS } from '@/config/characters';
import { canPlaceCardInSlot, getCharacterGeneration } from '@/services/deckRulesService';
import { getDeckSlotMapping } from '@/services/deckConfigService';
import { Card } from '@/models/Card';
import { DeckType } from '@/models/enums';

/**
 * 指定されたスロットに配置可能なキャラクターのみをフィルタリング
 *
 * @param slotId - 配置先のスロットID
 * @returns 配置可能なキャラクター名の配列
 */
export function getSelectableCharactersForSlot(slotId: number | null, deckType?: DeckType): string[] {
  if (slotId === null) {
    // スロット未選択時は全キャラクター表示
    return [...CHARACTERS];
  }

  const mapping = getDeckSlotMapping(deckType);
  const slotMapping = mapping.find((m) => m.slotId === slotId);
  if (!slotMapping) {
    return [...CHARACTERS];
  }

  const slotCharacter = slotMapping.characterName;

  // フリー枠の場合に、'フリー'を除く全キャラクターを表示
  if (slotCharacter === 'フリー') {
    return [...CHARACTERS];
  }

  const slotType = slotMapping.slotType;
  const slotGeneration = getCharacterGeneration(slotCharacter);

  // 各キャラクターのカードがスロットに配置可能かチェック
  const selectableCharacters = CHARACTERS.filter((characterName) => {
    // 基本チェック: レアリティなしで配置可能か
    const basicResult = canPlaceCardInSlot({ characterName }, slotId, deckType);
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

/**
 * 利用可能なカードから現在のカードと編成済みカードを除外
 * 
 * @param cards - フィルタリング対象のカード配列
 * @param currentCardId - 現在のスロットのカードID (除外対象)
 * @param assignedCardIds - 他のスロットに編成済みのカードID配列 (除外対象)
 * @returns 編成可能なカードのみの配列
 */
export function filterAvailableCards(
  cards: Card[],
  currentCardId: string | undefined,
  assignedCardIds: string[]
): Card[] {
  return cards.filter((card) => {
    if (currentCardId && card.id === currentCardId) return false;
    if (assignedCardIds.includes(card.id)) return false;
    return true;
  });
}