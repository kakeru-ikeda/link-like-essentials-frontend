/**
 * デッキ編成時のカードフィルタリングサービス
 *
 * スロットに配置可能なカードをフィルタリングするためのロジックを提供します。
 */

import { Card } from '@/models/card/Card';
import { canPlaceCardInSlot } from '@/services/deck/deckRulesService';
import { DeckSlot } from '@/models/deck/Deck';
import { DeckType } from '@/models/shared/enums';

/**
 * 指定されたスロットに配置可能なカードのみをフィルタリング
 *
 * @param cards - フィルタリング対象のカード配列
 * @param slotId - 配置先のスロットID
 * @param deckType - デッキタイプ
 * @returns 配置可能なカードのみの配列
 */
export function filterCardsBySlot(cards: Card[], slotId: number, deckType?: DeckType): Card[] {
  return cards.filter((card) => {
    const result = canPlaceCardInSlot(
      { characterName: card.characterName, rarity: card.rarity },
      slotId,
      deckType
    );
    return result.allowed;
  });
}

/**
 * 現在のスロットに配置可能な、既に編成済みのカードをフィルタリング
 * 
 * @param slots - デッキのスロット配列
 * @param currentSlotId - 現在選択中のスロットID
 * @param deckType - デッキタイプ
 * @returns 配置可能な編成済みカードの配列
 */
export function getAssignedCardsForSlot(
  slots: DeckSlot[],
  currentSlotId: number,
  deckType?: DeckType
): Card[] {
  return slots
    .filter((slot) => slot.slotId !== currentSlotId && slot.card)
    .map((slot) => slot.card!)
    .filter((card, index, self) => {
      // 重複を除外
      if (self.findIndex((c) => c.id === card.id) !== index) return false;
      
      // 現在のスロットに配置可能かチェック
      const validationResult = canPlaceCardInSlot(
        { characterName: card.characterName, rarity: card.rarity },
        currentSlotId,
        deckType
      );
      return validationResult.allowed;
    });
}