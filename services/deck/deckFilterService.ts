/**
 * デッキ編成時のカードフィルタリングサービス
 *
 * スロットに配置可能なカードをフィルタリングするためのロジックを提供します。
 */

import { CHARACTERS } from '@/config/characters';
import { Card } from '@/models/card/Card';
import { canPlaceCardInSlot } from '@/services/deck/deckRulesService';
import { DeckSlot } from '@/models/deck/Deck';
import { getDeckSlotMapping } from '@/services/deck/deckConfigService';
import { DeckType } from '@/models/shared/enums';

/**
 * 指定されたスロットに配置可能なキャラクターのみを返す
 */
export function getSelectableCharactersForSlot(
  slotId: number | null,
  deckType?: DeckType,
  cards?: Card[]
): string[] {
  if (slotId === null) {
    return [...CHARACTERS];
  }

  const mapping = getDeckSlotMapping(deckType);
  const slotMapping = mapping.find(m => m.slotId === slotId);
  if (!slotMapping) {
    return [...CHARACTERS];
  }

  const slotCharacter = slotMapping.characterName;
  if (slotCharacter === 'フリー' || slotCharacter === 'フレンド') {
    return [...CHARACTERS];
  }

  const selectableCharacters = CHARACTERS.filter(characterName => {
    const result = canPlaceCardInSlot({ characterName, cardName: undefined }, slotId, deckType);
    return result.allowed;
  });

  const baseCharacters = [
    slotCharacter,
    ...selectableCharacters.filter(char => char !== slotCharacter),
  ];

  if (slotMapping.slotType !== 'side' || !cards || cards.length === 0) {
    return baseCharacters;
  }

  const characterSet = new Set<string>(baseCharacters);

  cards
    .filter(card => (card.sidePlacementRules?.length ?? 0) > 0)
    .filter(card => {
      const result = canPlaceCardInSlot(
        {
          characterName: card.characterName,
          rarity: card.rarity,
          cardName: card.cardName,
          sidePlacementRules: card.sidePlacementRules,
        },
        slotId,
        deckType
      );
      return result.allowed;
    })
    .flatMap(card => card.characterName)
    .forEach(characterName => characterSet.add(characterName));

  const knownCharacters = new Set<string>(CHARACTERS);
  const sortedAdditionalCharacters = CHARACTERS.filter(
    characterName => characterName !== slotCharacter && characterSet.has(characterName)
  );
  const unknownCharacters = Array.from(characterSet).filter(
    characterName => characterName !== slotCharacter && !knownCharacters.has(characterName)
  );

  return [slotCharacter, ...sortedAdditionalCharacters, ...unknownCharacters];
}

/**
 * 現在のカードと編成済みカードを除外した候補を返す
 */
export function filterAvailableCards(
  cards: Card[],
  currentCardId: string | undefined,
  assignedCardIds: string[]
): Card[] {
  return cards.filter(card => {
    if (currentCardId && card.id === currentCardId) return false;
    if (assignedCardIds.includes(card.id)) return false;
    return true;
  });
}

/**
 * 指定されたスロットに配置可能なカードのみをフィルタリング
 *
 * @param cards - フィルタリング対象のカード配列
 * @param slotId - 配置先のスロットID
 * @param deckType - デッキタイプ
 * @returns 配置可能なカードのみの配列
 */
export function filterCardsBySlot(cards: Card[], slotId: number, deckType?: DeckType): Card[] {
  return cards.filter(card => {
    const result = canPlaceCardInSlot(
      {
        characterName: card.characterName,
        rarity: card.rarity,
        cardName: card.cardName,
        sidePlacementRules: card.sidePlacementRules,
      },
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
    .filter(slot => slot.slotId !== currentSlotId && slot.card)
    .map(slot => slot.card!)
    .filter((card, index, self) => {
      // 重複を除外
      if (self.findIndex(c => c.id === card.id) !== index) return false;

      // 現在のスロットに配置可能かチェック
      const validationResult = canPlaceCardInSlot(
        {
          characterName: card.characterName,
          rarity: card.rarity,
          cardName: card.cardName,
          sidePlacementRules: card.sidePlacementRules,
        },
        currentSlotId,
        deckType
      );
      return validationResult.allowed;
    });
}
