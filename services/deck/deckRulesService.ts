/**
 * デッキ編成ルール定義
 *
 * 105期デッキフレームにおける編成ルールを管理します。
 * - 基本ルール: 各スロットには対応するキャラクターのカードのみ編成可能
 * - 例外ルール: 特定条件下で他のキャラクター・期のカードも編成可能
 */

import { DeckType } from '@/models/shared/enums';
import { getDeckSlotMapping } from '@/services/deck/deckConfigService';
import { GENERATION_MEMBERS, GENERATION } from '@/config/generations';
import { UNIT_MEMBERS } from '@/config/characters';
import { SidePlacementRule } from '@/models/card/Card';

interface CardPlacementInfo {
  characterName: string | string[];
  rarity?: string;
  cardName?: string;
  sidePlacementRules?: SidePlacementRule[];
}

function normalizeCharacterNames(characterName: string | string[]): string[] {
  return Array.isArray(characterName) ? characterName : [characterName];
}

/**
 * キャラクター名から所属期を取得
 * 配列で渡された複数キャラクターカードの場合は、含まれるキャラクターから判定
 */
export function getCharacterGeneration(
  characterName: string | string[]
): number | null {
  const characterNames = normalizeCharacterNames(characterName);

  // 完全一致チェック
  for (const [gen, members] of Object.entries(GENERATION_MEMBERS)) {
    if (
      characterNames.length === 1 &&
      (members as readonly string[]).includes(characterNames[0])
    ) {
      return parseInt(gen);
    }
  }

  // 複数キャラクターカードの場合、各期のメンバーがすべて含まれているかチェック
  if (characterNames.length > 1) {
    for (const [gen, members] of Object.entries(GENERATION_MEMBERS)) {
      const allMembersIncluded = (members as readonly string[]).every(
        (member) => characterNames.includes(member)
      );
      if (allMembersIncluded) {
        return parseInt(gen);
      }
    }
  }

  return null;
}

/**
 * キャラクター名から所属ユニットを取得
 * 配列で渡された複数キャラクターカードの場合は、含まれるキャラクターから判定
 */
export function getCharacterUnit(
  characterName: string | string[]
): keyof typeof UNIT_MEMBERS | null {
  const characterNames = normalizeCharacterNames(characterName);

  // 完全一致チェック
  for (const [unit, members] of Object.entries(UNIT_MEMBERS)) {
    if (
      characterNames.length === 1 &&
      (members as readonly string[]).includes(characterNames[0])
    ) {
      return unit as keyof typeof UNIT_MEMBERS;
    }
  }

  // 複数キャラクターカードの場合、各ユニットのメンバーがすべて含まれているかチェック
  if (characterNames.length > 1) {
    for (const [unit, members] of Object.entries(UNIT_MEMBERS)) {
      const allMembersIncluded = (members as readonly string[]).every(
        (member) => characterNames.includes(member)
      );
      if (allMembersIncluded) {
        return unit as keyof typeof UNIT_MEMBERS;
      }
    }
  }

  return null;
}

/**
 * カードが特定のスロットに配置可能かチェック
 *
 * @param cardInfo - 配置するカードの情報
 * @param slotId - 配置先のスロットID
 * @param deckType - デッキタイプ
 * @returns 配置可否と理由
 */
export function canPlaceCardInSlot(
  cardInfo: CardPlacementInfo,
  slotId: number,
  deckType?: DeckType
): { allowed: boolean; reason?: string } {
  const mapping = getDeckSlotMapping(deckType);
  const slotMapping = mapping.find((m) => m.slotId === slotId);

  if (!slotMapping) {
    return { allowed: false, reason: '無効なスロットIDです' };
  }

  const slotCharacter = slotMapping.characterName;
  const slotType = slotMapping.slotType;
  const characterNames = normalizeCharacterNames(cardInfo.characterName);
  const normalizedDeckType = deckType ?? DeckType.TERM_105;
  const sidePlacementRules = cardInfo.sidePlacementRules ?? [];

  // フリー枠はすべてのカードが配置可能
  if (slotCharacter === 'フリー') {
    return { allowed: true };
  }

  // フレンド枠はすべてのカードが配置可能
  if (slotCharacter === 'フレンド') {
    return { allowed: true };
  }

  // 複数キャラクターカードはメインに配置不可
  if (slotType === 'main' && characterNames.length > 1) {
    return {
      allowed: false,
      reason: '複数キャラクターのカードはメインスロットに配置できません',
    };
  }

  // 基本ルール: 単一キャラクターのカードは同じキャラクターのスロットに配置可能
  if (characterNames.length === 1 && characterNames[0] === slotCharacter) {
    return { allowed: true };
  }

  // sidePlacementRules があるカードは、指定されたサイドスロットに追加で例外配置可能
  if (slotType === 'side' && sidePlacementRules.length > 0) {
    const matchedSidePlacementRule = sidePlacementRules.some((rule) => {
      const matchesDeckType =
        !rule.deckTypes || rule.deckTypes === normalizedDeckType;
      const matchesCharacter = rule.characters.includes(slotCharacter);
      return matchesDeckType && matchesCharacter;
    });

    if (matchedSidePlacementRule) {
      return { allowed: true };
    }

    return {
      allowed: false,
      reason: 'このカードは指定されたサイドスロットにのみ配置できます',
    };
  }

  return {
    allowed: false,
    reason: `${slotCharacter}のスロットには${slotCharacter}のカードのみ配置できます`,
  };
}
