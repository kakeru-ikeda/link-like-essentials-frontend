/**
 * キャラクター選択フィルタリングサービス
 *
 * スロットに配置可能なキャラクターのみを表示するためのロジックを提供します。
 */

import { CHARACTERS, UNIT_MEMBERS } from '@/config/characters';
import { GENERATION } from '@/config/generations';
import {
  canPlaceCardInSlot,
  getCharacterGeneration,
} from '@/services/deck/deckRulesService';
import { getDeckSlotMapping } from '@/services/deck/deckConfigService';
import { Card } from '@/models/card/Card';
import { DeckType } from '@/models/shared/enums';

/**
 * 指定されたスロットに配置可能なキャラクターのみをフィルタリング
 *
 * @param slotId - 配置先のスロットID
 * @returns 配置可能なキャラクター名の配列
 */
export function getSelectableCharactersForSlot(
  slotId: number | null,
  deckType?: DeckType
): string[] {
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

  // スロットキャラクターがRuri&Toメンバーかどうかをチェック
  const isRuriAndToSlot = (
    UNIT_MEMBERS['Ruri&To'] as readonly string[]
  ).includes(slotCharacter);

  // スロットキャラクターがPRINCEε>ε>メンバーかどうかをチェック
  const isPrinceSlot = (
    UNIT_MEMBERS['PRINCEε>ε>'] as readonly string[]
  ).includes(slotCharacter);

  // 各キャラクターのカードがスロットに配置可能かチェック
  const selectableCharacters = CHARACTERS.filter((characterName) => {
    // 基本チェック: レアリティなしで配置可能か
    const basicResult = canPlaceCardInSlot(
      { characterName, cardName: undefined },
      slotId,
      deckType
    );
    if (basicResult.allowed) {
      return true;
    }

    // 102期生の追加チェック: LRカードが配置可能か
    const characterGeneration = getCharacterGeneration(characterName);
    if (characterGeneration === GENERATION.TERM_102) {
      // 102期生LRは103期・104期のサイドに配置可能
      const allowedGenerations: number[] = [
        GENERATION.TERM_103,
        GENERATION.TERM_104,
      ];
      if (
        slotGeneration &&
        allowedGenerations.includes(slotGeneration) &&
        slotType === 'side'
      ) {
        return true;
      }
    }

    // 103期生＆カードは103期判定ベースで候補追加
    if (characterGeneration === GENERATION.TERM_103 && slotType === 'side') {
      const allowedGenerations: number[] = [
        GENERATION.TERM_102,
        GENERATION.TERM_103,
        GENERATION.TERM_104,
        GENERATION.TERM_105,
      ];
      if (slotGeneration && allowedGenerations.includes(slotGeneration)) {
        return true;
      }
    }

    // 大沢瑠璃乃の追加チェック: Ruri&Toメンバーのサイドに「平成ギャルズ!!!!」が配置可能
    if (
      characterName === '大沢瑠璃乃' &&
      isRuriAndToSlot &&
      slotType === 'side'
    ) {
      return true;
    }

    // 安養寺姫芽の追加チェック: PRINCEε>ε>メンバーのサイドに「IcHiGo milK love」が配置可能
    if (characterName === '安養寺姫芽' && isPrinceSlot && slotType === 'side') {
      return true;
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
