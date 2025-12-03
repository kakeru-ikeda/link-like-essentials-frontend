/**
 * デッキ編成時のカードフィルタリングサービス
 *
 * スロットに配置可能なカードをフィルタリングするためのロジックを提供します。
 */

import { Card } from '@/models/Card';
import { canPlaceCardInSlot } from '@/constants/deckRules';

/**
 * 指定されたスロットに配置可能なカードのみをフィルタリング
 *
 * @param cards - フィルタリング対象のカード配列
 * @param slotId - 配置先のスロットID
 * @returns 配置可能なカードのみの配列
 */
export function filterCardsBySlot(cards: Card[], slotId: number): Card[] {
  return cards.filter((card) => {
    const result = canPlaceCardInSlot(
      { characterName: card.characterName, rarity: card.rarity },
      slotId
    );
    return result.allowed;
  });
}
