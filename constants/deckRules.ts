/**
 * デッキ編成ルール定義
 *
 * 105期デッキフレームにおける編成ルールを管理します。
 * - 基本ルール: 各スロットには対応するキャラクターのカードのみ編成可能
 * - 例外ルール: 特定条件下で他のキャラクター・期のカードも編成可能
 */

import { DECK_SLOT_MAPPING, SlotType } from './deckConfig';

/**
 * 期別所属キャラクター
 */
export const GENERATION_MEMBERS = {
  101: ['大賀美沙知'],
  102: ['乙宗梢', '夕霧綴理', '藤島慈'],
  103: ['日野下花帆', '村野さやか', '大沢瑠璃乃'],
  104: ['徒町小鈴', '百生吟子', '安養寺姫芽'],
  105: ['桂城泉', 'セラス'],
} as const;

/**
 * ユニット別所属キャラクター
 */
export const UNIT_MEMBERS = {
  'Cerise Bouquet': ['乙宗梢', '日野下花帆', '百生吟子'],
  DOLLCHESTRA: ['夕霧綴理', '村野さやか', '徒町小鈴'],
  'Mira Cra Park': ['藤島慈', '大沢瑠璃乃', '安養寺姫芽'],
  'Edel Note': ['桂城泉', 'セラス'],
} as const;

/**
 * キャラクター名から所属期を取得
 * ＆が含まれる複合カードの場合は、含まれるキャラクターから判定
 */
export function getCharacterGeneration(characterName: string): number | null {
  // 完全一致チェック
  for (const [gen, members] of Object.entries(GENERATION_MEMBERS)) {
    if ((members as readonly string[]).includes(characterName)) {
      return parseInt(gen);
    }
  }

  // ＆が含まれる複合カードの場合、各期のメンバーが含まれているかチェック
  if (characterName.includes('＆')) {
    for (const [gen, members] of Object.entries(GENERATION_MEMBERS)) {
      const allMembersIncluded = (members as readonly string[]).every((member) =>
        characterName.includes(member)
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
 * ＆が含まれる複合カードの場合は、含まれるキャラクターから判定
 */
export function getCharacterUnit(
  characterName: string
): keyof typeof UNIT_MEMBERS | null {
  // 完全一致チェック
  for (const [unit, members] of Object.entries(UNIT_MEMBERS)) {
    if ((members as readonly string[]).includes(characterName)) {
      return unit as keyof typeof UNIT_MEMBERS;
    }
  }

  // ＆が含まれる複合カードの場合、各ユニットのメンバーが含まれているかチェック
  if (characterName.includes('＆')) {
    for (const [unit, members] of Object.entries(UNIT_MEMBERS)) {
      const allMembersIncluded = (members as readonly string[]).every((member) =>
        characterName.includes(member)
      );
      if (allMembersIncluded) {
        return unit as keyof typeof UNIT_MEMBERS;
      }
    }
  }

  return null;
}

/**
 * カードが特定のスロットに配置可能かチェック（105期デッキフレーム用）
 *
 * @param card - 配置するカード
 * @param slotId - 配置先のスロットID
 * @returns 配置可否と理由
 */
export function canPlaceCardInSlot(
  card: {
    characterName: string;
    rarity?: string;
  },
  slotId: number
): { allowed: boolean; reason?: string } {
  const slotMapping = DECK_SLOT_MAPPING.find((m) => m.slotId === slotId);
  if (!slotMapping) {
    return { allowed: false, reason: '無効なスロットIDです' };
  }

  const slotCharacter = slotMapping.characterName;
  const slotType = slotMapping.slotType;
  const cardGeneration = getCharacterGeneration(card.characterName);

  // フリー枠はすべてのカードが配置可能
  if (slotCharacter === 'フリー') {
    return { allowed: true };
  }

  // 基本ルール: 同じキャラクターのカードは配置可能
  if (card.characterName === slotCharacter) {
    return { allowed: true };
  }

  // --- 以下、例外ルール ---

  // 102期生LRカードの特殊ルール
  if (cardGeneration === 102 && card.rarity === 'LR') {
    const slotGeneration = getCharacterGeneration(slotCharacter);
    
    // 102期のメイン・サイドに配置可能
    if (slotGeneration === 102) {
      return { allowed: true };
    }
    
    // 103期・104期のサイドのみ配置可能
    if (slotGeneration && [103, 104].includes(slotGeneration) && slotType === 'side') {
      return { allowed: true };
    }
  }

  // 大賀美沙知のカード（101期生）
  if (card.characterName === '大賀美沙知') {
    const slotGeneration = getCharacterGeneration(slotCharacter);
    
    // 102期・103期のサイドのみ配置可能
    if (slotGeneration && [102, 103].includes(slotGeneration) && slotType === 'side') {
      return { allowed: true };
    }
    
    return {
      allowed: false,
      reason: '大賀美沙知は102期・103期のサイドカードにのみ配置できます',
    };
  }

  // 102期生＆カード（乙宗梢＆夕霧綴理＆藤島慈）
  if (cardGeneration === 102 && card.characterName.includes('＆')) {
    const slotGeneration = getCharacterGeneration(slotCharacter);
    
    // 102期・103期・104期のサイドのみ配置可能
    if (slotGeneration && [102, 103, 104].includes(slotGeneration) && slotType === 'side') {
      return { allowed: true };
    }
    
    return {
      allowed: false,
      reason: '蓮ノ大三角は102〜104期のサイドカードにのみ配置できます',
    };
  }

  // Edel Note＆カード（桂城泉＆セラス）
  const cardUnit = getCharacterUnit(card.characterName);
  if (cardUnit === 'Edel Note' && card.characterName.includes('＆')) {
    const slotUnit = getCharacterUnit(slotCharacter);
    
    // Edel Noteのサイドのみ配置可能
    if (slotUnit === 'Edel Note' && slotType === 'side') {
      return { allowed: true };
    }
    
    return {
      allowed: false,
      reason: 'EdeliedはEdel Noteのサイドカードにのみ配置できます',
    };
  }

  // どの例外ルールにも該当しない
  return {
    allowed: false,
    reason: `${slotCharacter}のスロットには${slotCharacter}のカードのみ配置できます`,
  };
}
