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
 * カードが特定のスロットに配置可能かチェック
 *
 * @param cardInfo - 配置するカードの情報
 * @param slotId - 配置先のスロットID
 * @param deckType - デッキタイプ
 * @returns 配置可否と理由
 */
export function canPlaceCardInSlot(
  cardInfo: { characterName: string; rarity?: string; cardName?: string },
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
  const cardGeneration = getCharacterGeneration(cardInfo.characterName);

  // フリー枠はすべてのカードが配置可能
  if (slotCharacter === 'フリー') {
    return { allowed: true };
  }

  // フレンド枠はすべてのカードが配置可能
  if (slotCharacter === 'フレンド') {
    return { allowed: true };
  }

  // 基本ルール: 同じキャラクターのカードは配置可能
  if (cardInfo.characterName === slotCharacter) {
    return { allowed: true };
  }

  // --- 以下、例外ルール ---

  // 102期生LRカードの特殊ルール
  if (cardGeneration === GENERATION.TERM_102 && cardInfo.rarity === 'LR') {
    const slotGeneration = getCharacterGeneration(slotCharacter);

    // 102期・103期・104期のサイドに配置可能
    const allowedGenerations: number[] = [GENERATION.TERM_102, GENERATION.TERM_103, GENERATION.TERM_104];
    if (slotGeneration && allowedGenerations.includes(slotGeneration) && slotType === 'side') {
      return { allowed: true };
    }
  }

  // 大賀美沙知のカード（101期生）
  if (cardInfo.characterName === '大賀美沙知') {
    const slotGeneration = getCharacterGeneration(slotCharacter);
    
    // 102期・103期のサイドのみ配置可能
    const allowedGenerations: number[] = [GENERATION.TERM_102, GENERATION.TERM_103];
    if (slotGeneration && allowedGenerations.includes(slotGeneration) && slotType === 'side') {
      return { allowed: true };
    }
    
    return {
      allowed: false,
      reason: '大賀美沙知は102期・103期のサイドカードにのみ配置できます',
    };
  }

  // 102期生＆カード（乙宗梢＆夕霧綴理＆藤島慈）
  if (cardGeneration === GENERATION.TERM_102 && cardInfo.characterName.includes('＆')) {
    const slotGeneration = getCharacterGeneration(slotCharacter);
    
    // 102期・103期・104期のサイドのみ配置可能
    const allowedGenerations: number[] = [GENERATION.TERM_102, GENERATION.TERM_103, GENERATION.TERM_104];
    if (slotGeneration && allowedGenerations.includes(slotGeneration) && slotType === 'side') {
      return { allowed: true };
    }
    
    return {
      allowed: false,
      reason: '蓮ノ大三角は102〜104期のサイドカードにのみ配置できます',
    };
  }

  // Edel Note＆カード（桂城泉＆セラス）
  const cardUnit = getCharacterUnit(cardInfo.characterName);
  if (cardUnit === 'Edel Note' && cardInfo.characterName.includes('＆')) {
    const slotGeneration = getCharacterGeneration(slotCharacter);

    // 102期・103期・104期のサイドに配置可能
    const allowedGenerations: number[] = [GENERATION.TERM_102, GENERATION.TERM_103, GENERATION.TERM_104];
    if (slotGeneration && allowedGenerations.includes(slotGeneration) && slotType === 'side') {
      return { allowed: true };
    }

    return {
      allowed: false,
      reason: 'Edeliedは102〜104期のサイドカードにのみ配置できます',
    };
  }

  // Ruri&To 平成ギャルズ!!!!
  if (cardInfo.characterName === '大沢瑠璃乃' && cardInfo.cardName === '平成ギャルズ!!!!') {
    // スロットキャラクターがRuri&Toメンバー（大沢瑠璃乃、村野さやか、徒町小鈴、セラス）かチェック
    const ruriAndToMembers = UNIT_MEMBERS['Ruri&To'];
    const isRuriAndToSlot = (ruriAndToMembers as readonly string[]).includes(slotCharacter);
    
    // Ruri&Toのサイドのみ配置可能
    if (isRuriAndToSlot && slotType === 'side') {
      return { allowed: true };
    }
    
    return {
      allowed: false,
      reason: '平成ギャルズ!!!!はRuri&Toのサイドカードにのみ配置できます',
    };
  }

  // PRINCEε>ε> IcHiGo milK love
  if (cardInfo.characterName === '安養寺姫芽' && cardInfo.cardName === 'IcHiGo milK love') {
    // スロットキャラクターがPRINCEε>ε>メンバー（安養寺姫芽、日野下花帆、百生吟子、桂城泉）かチェック
    const princeMembers = UNIT_MEMBERS['PRINCEε>ε>'];
    const isPrinceSlot = (princeMembers as readonly string[]).includes(slotCharacter);
    
    // PRINCEε>ε>のサイドのみ配置可能
    if (isPrinceSlot && slotType === 'side') {
      return { allowed: true };
    }
    
    return {
      allowed: false,
      reason: 'IcHiGo milK loveはPRINCEε>ε>のサイドカードにのみ配置できます',
    };
  }

  // どの例外ルールにも該当しない
  return {
    allowed: false,
    reason: `${slotCharacter}のスロットには${slotCharacter}のカードのみ配置できます`,
  };
}
