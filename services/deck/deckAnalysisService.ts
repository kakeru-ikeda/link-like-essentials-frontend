import { Deck } from '@/models/domain/Deck';
import { Card } from '@/models/domain/Card';
import { getDeckSlotMapping } from '@/services/deck/deckConfigService';

/**
 * デッキ分析サービス
 * デッキの状態を分析し、必要な情報を抽出する
 */

/**
 * センターカードを取得
 * centerCharacterのmainスロットに配置されたカードを返す
 */
export function getCenterCard(deck: Deck | null): Card | null {
  if (!deck?.centerCharacter || !deck?.slots || !deck?.deckType) return null;

  // デッキタイプに応じたスロットマッピングを取得
  const mapping = getDeckSlotMapping(deck.deckType);

  // centerCharacterのmainスロットを特定
  const centerSlotMapping = mapping.find(
    (m) => m.characterName === deck.centerCharacter && m.slotType === 'main'
  );

  if (!centerSlotMapping) return null;

  // 該当するスロットからカードを取得
  const centerSlot = deck.slots.find(
    (slot) => slot.slotId === centerSlotMapping.slotId && slot.card !== null
  );

  return centerSlot?.card || null;
}

/**
 * センター以外のLRカードを取得
 * スペシャルアピールを持つLRカードのみを返す
 */
export function getOtherLRCards(deck: Deck | null, centerCard: Card | null): Card[] {
  if (!deck?.slots) return [];

  const lrCards: Card[] = [];

  deck.slots.forEach((slot) => {
    const card = slot.card;
    // センターカードは除外、LRでスペシャルアピール持ちのみ
    if (
      card &&
      card.rarity === 'LR' &&
      card.detail?.specialAppeal &&
      card.id !== centerCard?.id
    ) {
      lrCards.push(card);
    }
  });

  return lrCards;
}

/**
 * デッキにカードが編成されているか確認
 */
export function hasCenterCard(deck: Deck | null): boolean {
  return getCenterCard(deck) !== null;
}
