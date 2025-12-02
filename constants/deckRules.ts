/**
 * デッキ編成ルール定義
 *
 * このファイルでは、カードの編成条件を管理します。
 * 各期・ユニットごとの所属キャラクターと、特殊な編成ルールを定義しています。
 */

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
 * デッキスロットタイプ
 */
export type SlotType = 'main' | 'side';

/**
 * カード編成条件の型定義
 */
export interface CardPlacementRule {
  /** ルール名 */
  name: string;
  /** 対象カードの判定条件 */
  condition: {
    characterName?: string;
    characterNamePattern?: string; // 「&」を含むなどのパターン
    generation?: number;
    unit?: keyof typeof UNIT_MEMBERS;
    rarity?: string;
  };
  /** 配置可能な条件 */
  allowedPlacements: {
    generations?: number[];
    units?: (keyof typeof UNIT_MEMBERS)[];
    slotTypes: SlotType[];
  };
}

/**
 * カード編成ルール一覧
 */
export const DECK_PLACEMENT_RULES: CardPlacementRule[] = [
  // 102期生レアリティLRのカード
  {
    name: '102期生LR',
    condition: {
      generation: 102,
      rarity: 'LR',
    },
    allowedPlacements: {
      generations: [102, 103, 104],
      slotTypes: ['main', 'side'], // 102期はメイン+サイド、103/104はサイドのみ
    },
  },
  // 大賀美沙知のカード
  {
    name: '大賀美沙知',
    condition: {
      characterName: '大賀美沙知',
    },
    allowedPlacements: {
      generations: [102, 103],
      slotTypes: ['side'], // サイドのみ
    },
  },
  // 102期生＆カード（乙宗梢＆夕霧綴理＆藤島慈）
  {
    name: '102期生＆カード',
    condition: {
      generation: 102,
      characterNamePattern: '&',
    },
    allowedPlacements: {
      generations: [102, 103, 104],
      slotTypes: ['side'], // サイドのみ
    },
  },
  // Edel Note＆カード（桂城泉＆セラス）
  {
    name: 'Edel Note＆カード',
    condition: {
      unit: 'Edel Note',
      characterNamePattern: '&',
    },
    allowedPlacements: {
      units: ['Edel Note'],
      slotTypes: ['side'], // サイドのみ
    },
  },
];

/**
 * キャラクター名から所属期を取得
 */
export function getCharacterGeneration(characterName: string): number | null {
  for (const [gen, members] of Object.entries(GENERATION_MEMBERS)) {
    if ((members as readonly string[]).includes(characterName)) {
      return parseInt(gen);
    }
  }
  return null;
}

/**
 * キャラクター名から所属ユニットを取得
 */
export function getCharacterUnit(
  characterName: string
): keyof typeof UNIT_MEMBERS | null {
  for (const [unit, members] of Object.entries(UNIT_MEMBERS)) {
    if ((members as readonly string[]).includes(characterName)) {
      return unit as keyof typeof UNIT_MEMBERS;
    }
  }
  return null;
}

/**
 * カードが特定のスロットに配置可能かチェック
 */
export function canPlaceCard(
  card: {
    characterName: string;
    rarity?: string;
  },
  slot: {
    generation?: number;
    unit?: keyof typeof UNIT_MEMBERS;
    slotType: SlotType;
  }
): { allowed: boolean; reason?: string } {
  const cardGeneration = getCharacterGeneration(card.characterName);
  const cardUnit = getCharacterUnit(card.characterName);

  // 基本配置ルール: 同期・同ユニットなら配置可能
  const isSameGeneration = slot.generation === cardGeneration;
  const isSameUnit = slot.unit === cardUnit;

  if (isSameGeneration || isSameUnit) {
    return { allowed: true };
  }

  // 特殊ルールのチェック
  for (const rule of DECK_PLACEMENT_RULES) {
    // ルールの条件に合致するかチェック
    let matchesCondition = true;

    if (rule.condition.characterName) {
      matchesCondition =
        matchesCondition && card.characterName === rule.condition.characterName;
    }

    if (rule.condition.characterNamePattern) {
      matchesCondition =
        matchesCondition &&
        card.characterName.includes(rule.condition.characterNamePattern);
    }

    if (rule.condition.generation) {
      matchesCondition =
        matchesCondition && cardGeneration === rule.condition.generation;
    }

    if (rule.condition.unit) {
      matchesCondition = matchesCondition && cardUnit === rule.condition.unit;
    }

    if (rule.condition.rarity) {
      matchesCondition =
        matchesCondition && card.rarity === rule.condition.rarity;
    }

    if (!matchesCondition) continue;

    // ルールに合致した場合、配置可能かチェック
    const allowedByGeneration =
      !rule.allowedPlacements.generations ||
      (slot.generation &&
        rule.allowedPlacements.generations.includes(slot.generation));

    const allowedByUnit =
      !rule.allowedPlacements.units ||
      (slot.unit && rule.allowedPlacements.units.includes(slot.unit));

    const allowedBySlotType =
      rule.allowedPlacements.slotTypes.includes(slot.slotType);

    // 102期生LRの特殊処理: 102期ならメイン+サイド、103/104はサイドのみ
    if (rule.name === '102期生LR' && slot.generation) {
      if (slot.generation === 102) {
        if (allowedBySlotType) {
          return { allowed: true };
        }
      } else if ([103, 104].includes(slot.generation)) {
        if (slot.slotType === 'side') {
          return { allowed: true };
        }
      }
      continue;
    }

    if (allowedByGeneration && allowedByUnit && allowedBySlotType) {
      return { allowed: true };
    }

    // ルールに合致したが配置不可の場合
    if (matchesCondition && !allowedBySlotType) {
      return {
        allowed: false,
        reason: `${rule.name}は${rule.allowedPlacements.slotTypes.join('・')}にのみ配置できます`,
      };
    }
  }

  return {
    allowed: false,
    reason: '編成条件を満たしていません',
  };
}
