import { CharacterName } from '@/constants/characters';
import { DeckType } from '@/models/enums';

export const DECK_SLOT_COUNT = 18;

/**
 * デッキスロットタイプ
 * - main: メインカード（各キャラクターの1枚目）
 * - side: サイドカード（各キャラクターの2枚目以降）
 */
export type SlotType = 'main' | 'side';

export interface DeckSlotMapping {
  slotId: number;
  characterName: CharacterName;
  slotType: SlotType;
  row: number;
  col: number;
}

export const DECK_SLOT_MAPPING_105: DeckSlotMapping[] = [
  // 上段（105期生）
  { slotId: 0, characterName: 'セラス', slotType: 'main', row: 0, col: 0 },
  { slotId: 1, characterName: 'セラス', slotType: 'side', row: 0, col: 1 },
  { slotId: 2, characterName: '桂城泉', slotType: 'main', row: 0, col: 2 },
  { slotId: 3, characterName: '桂城泉', slotType: 'side', row: 0, col: 3 },
  { slotId: 4, characterName: 'フリー', slotType: 'main', row: 0, col: 4 },
  { slotId: 5, characterName: 'フリー', slotType: 'main', row: 0, col: 5 },

  // 中段（104期生）
  { slotId: 6, characterName: '百生吟子', slotType: 'main', row: 1, col: 0 },
  { slotId: 7, characterName: '百生吟子', slotType: 'side', row: 1, col: 1 },
  { slotId: 8, characterName: '徒町小鈴', slotType: 'main', row: 1, col: 2 },
  { slotId: 9, characterName: '徒町小鈴', slotType: 'side', row: 1, col: 3 },
  { slotId: 10, characterName: '安養寺姫芽', slotType: 'main', row: 1, col: 4 },
  { slotId: 11, characterName: '安養寺姫芽', slotType: 'side', row: 1, col: 5 },

  // 下段（103期生）
  { slotId: 12, characterName: '日野下花帆', slotType: 'main', row: 2, col: 0 },
  { slotId: 13, characterName: '日野下花帆', slotType: 'side', row: 2, col: 1 },
  { slotId: 14, characterName: '村野さやか', slotType: 'main', row: 2, col: 2 },
  { slotId: 15, characterName: '村野さやか', slotType: 'side', row: 2, col: 3 },
  { slotId: 16, characterName: '大沢瑠璃乃', slotType: 'main', row: 2, col: 4 },
  { slotId: 17, characterName: '大沢瑠璃乃', slotType: 'side', row: 2, col: 5 },
];

export const DECK_SLOT_MAPPING_104: DeckSlotMapping[] = [
  // 上段（104期生）
  { slotId: 0, characterName: '百生吟子', slotType: 'main', row: 0, col: 0 },
  { slotId: 1, characterName: '百生吟子', slotType: 'side', row: 0, col: 1 },
  { slotId: 2, characterName: '徒町小鈴', slotType: 'main', row: 0, col: 2 },
  { slotId: 3, characterName: '徒町小鈴', slotType: 'side', row: 0, col: 3 },
  { slotId: 4, characterName: '安養寺姫芽', slotType: 'main', row: 0, col: 4 },
  { slotId: 5, characterName: '安養寺姫芽', slotType: 'side', row: 0, col: 5 },

  // 中段（103期生）
  { slotId: 6, characterName: '日野下花帆', slotType: 'main', row: 1, col: 0 },
  { slotId: 7, characterName: '日野下花帆', slotType: 'side', row: 1, col: 1 },
  { slotId: 8, characterName: '村野さやか', slotType: 'main', row: 1, col: 2 },
  { slotId: 9, characterName: '村野さやか', slotType: 'side', row: 1, col: 3 },
  { slotId: 10, characterName: '大沢瑠璃乃', slotType: 'main', row: 1, col: 4 },
  { slotId: 11, characterName: '大沢瑠璃乃', slotType: 'side', row: 1, col: 5 },

  // 下段（102期生）
  { slotId: 12, characterName: '乙宗梢', slotType: 'main', row: 2, col: 0 },
  { slotId: 13, characterName: '乙宗梢', slotType: 'side', row: 2, col: 1 },
  { slotId: 14, characterName: '夕霧綴理', slotType: 'main', row: 2, col: 2 },
  { slotId: 15, characterName: '夕霧綴理', slotType: 'side', row: 2, col: 3 },
  { slotId: 16, characterName: '藤島慈', slotType: 'main', row: 2, col: 4 },
  { slotId: 17, characterName: '藤島慈', slotType: 'side', row: 2, col: 5 },
];

export const DECK_SLOT_MAPPING_103: DeckSlotMapping[] = [
  // 上段（103期生）
  { slotId: 0, characterName: '日野下花帆', slotType: 'main', row: 0, col: 0 },
  { slotId: 1, characterName: '日野下花帆', slotType: 'side', row: 0, col: 1 },
  { slotId: 2, characterName: '日野下花帆', slotType: 'side', row: 0, col: 2 },
  { slotId: 3, characterName: '村野さやか', slotType: 'main', row: 0, col: 3 },
  { slotId: 4, characterName: '村野さやか', slotType: 'side', row: 0, col: 4 },
  { slotId: 5, characterName: '村野さやか', slotType: 'side', row: 0, col: 5 },
  { slotId: 6, characterName: '大沢瑠璃乃', slotType: 'main', row: 1, col: 0 },
  { slotId: 7, characterName: '大沢瑠璃乃', slotType: 'side', row: 1, col: 1 },
  { slotId: 8, characterName: '大沢瑠璃乃', slotType: 'side', row: 1, col: 2 },

  // 下段 （102期生）
  { slotId: 9, characterName: '乙宗梢', slotType: 'main', row: 2, col: 0 },
  { slotId: 10, characterName: '乙宗梢', slotType: 'side', row: 2, col: 1 },
  { slotId: 11, characterName: '乙宗梢', slotType: 'side', row: 2, col: 2 },
  { slotId: 12, characterName: '夕霧綴理', slotType: 'main', row: 2, col: 3 },
  { slotId: 13, characterName: '夕霧綴理', slotType: 'side', row: 2, col: 4 },
  { slotId: 14, characterName: '夕霧綴理', slotType: 'side', row: 2, col: 5 },
  { slotId: 15, characterName: '藤島慈', slotType: 'main', row: 2, col: 6 },
  { slotId: 16, characterName: '藤島慈', slotType: 'side', row: 2, col: 7 },
  { slotId: 17, characterName: '藤島慈', slotType: 'side', row: 2, col: 8 },
];

export const DECK_SLOT_MAPPING_105_FT_KOZUE: DeckSlotMapping[] = [
  // 上段（105期生ft.梢）
  { slotId: 0, characterName: '乙宗梢', slotType: 'main', row: 0, col: 0 },
  { slotId: 1, characterName: '乙宗梢', slotType: 'side', row: 0, col: 1 },
  { slotId: 2, characterName: 'セラス', slotType: 'main', row: 0, col: 2 },
  { slotId: 3, characterName: 'セラス', slotType: 'side', row: 0, col: 3 },
  { slotId: 4, characterName: '桂城泉', slotType: 'main', row: 0, col: 4 },
  { slotId: 5, characterName: '桂城泉', slotType: 'side', row: 0, col: 5 },

  // 中段（104期生）
  { slotId: 6, characterName: '百生吟子', slotType: 'main', row: 1, col: 0 },
  { slotId: 7, characterName: '百生吟子', slotType: 'side', row: 1, col: 1 },
  { slotId: 8, characterName: '徒町小鈴', slotType: 'main', row: 1, col: 2 },
  { slotId: 9, characterName: '徒町小鈴', slotType: 'side', row: 1, col: 3 },
  { slotId: 10, characterName: '安養寺姫芽', slotType: 'main', row: 1, col: 4 },
  { slotId: 11, characterName: '安養寺姫芽', slotType: 'side', row: 1, col: 5 },

  // 下段（103期生）
  { slotId: 12, characterName: '日野下花帆', slotType: 'main', row: 2, col: 0 },
  { slotId: 13, characterName: '日野下花帆', slotType: 'side', row: 2, col: 1 },
  { slotId: 14, characterName: '村野さやか', slotType: 'main', row: 2, col: 2 },
  { slotId: 15, characterName: '村野さやか', slotType: 'side', row: 2, col: 3 },
  { slotId: 16, characterName: '大沢瑠璃乃', slotType: 'main', row: 2, col: 4 },
  { slotId: 17, characterName: '大沢瑠璃乃', slotType: 'side', row: 2, col: 5 },
];

export const DECK_SLOT_MAPPING_105_FT_TSUZURI: DeckSlotMapping[] = [
  // 上段（105期生ft.綴理）
  { slotId: 0, characterName: '夕霧綴理', slotType: 'main', row: 0, col: 0 },
  { slotId: 1, characterName: '夕霧綴理', slotType: 'side', row: 0, col: 1 },
  { slotId: 2, characterName: 'セラス', slotType: 'main', row: 0, col: 2 },
  { slotId: 3, characterName: 'セラス', slotType: 'side', row: 0, col: 3 },
  { slotId: 4, characterName: '桂城泉', slotType: 'main', row: 0, col: 4 },
  { slotId: 5, characterName: '桂城泉', slotType: 'side', row: 0, col: 5 },

  // 中段（104期生）
  { slotId: 6, characterName: '百生吟子', slotType: 'main', row: 1, col: 0 },
  { slotId: 7, characterName: '百生吟子', slotType: 'side', row: 1, col: 1 },
  { slotId: 8, characterName: '徒町小鈴', slotType: 'main', row: 1, col: 2 },
  { slotId: 9, characterName: '徒町小鈴', slotType: 'side', row: 1, col: 3 },
  { slotId: 10, characterName: '安養寺姫芽', slotType: 'main', row: 1, col: 4 },
  { slotId: 11, characterName: '安養寺姫芽', slotType: 'side', row: 1, col: 5 },
  
  // 下段（103期生）
  { slotId: 12, characterName: '日野下花帆', slotType: 'main', row: 2, col: 0 },
  { slotId: 13, characterName: '日野下花帆', slotType: 'side', row: 2, col: 1 },
  { slotId: 14, characterName: '村野さやか', slotType: 'main', row: 2, col: 2 },
  { slotId: 15, characterName: '村野さやか', slotType: 'side', row: 2, col: 3 },
  { slotId: 16, characterName: '大沢瑠璃乃', slotType: 'main', row: 2, col: 4 },
  { slotId: 17, characterName: '大沢瑠璃乃', slotType: 'side', row: 2, col: 5 },
];

export const DECK_SLOT_MAPPING_105_FT_MEGUMI: DeckSlotMapping[] = [
  // 上段（105期生ft.慈）
  { slotId: 0, characterName: '藤島慈', slotType: 'main', row: 0, col: 0 },
  { slotId: 1, characterName: '藤島慈', slotType: 'side', row: 0, col: 1 },
  { slotId: 2, characterName: 'セラス', slotType: 'main', row: 0, col: 2 },
  { slotId: 3, characterName: 'セラス', slotType: 'side', row: 0, col: 3 },
  { slotId: 4, characterName: '桂城泉', slotType: 'main', row: 0, col: 4 },
  { slotId: 5, characterName: '桂城泉', slotType: 'side', row: 0, col: 5 },

  // 中段（104期生）
  { slotId: 6, characterName: '百生吟子', slotType: 'main', row: 1, col: 0 },
  { slotId: 7, characterName: '百生吟子', slotType: 'side', row: 1, col: 1 },
  { slotId: 8, characterName: '徒町小鈴', slotType: 'main', row: 1, col: 2 },
  { slotId: 9, characterName: '徒町小鈴', slotType: 'side', row: 1, col: 3 },
  { slotId: 10, characterName: '安養寺姫芽', slotType: 'main', row: 1, col: 4 },
  { slotId: 11, characterName: '安養寺姫芽', slotType: 'side', row: 1, col: 5 },

  // 下段（103期生）
  { slotId: 12, characterName: '日野下花帆', slotType: 'main', row: 2, col: 0 },
  { slotId: 13, characterName: '日野下花帆', slotType: 'side', row: 2, col: 1 },
  { slotId: 14, characterName: '村野さやか', slotType: 'main', row: 2, col: 2 },
  { slotId: 15, characterName: '村野さやか', slotType: 'side', row: 2, col: 3 },
  { slotId: 16, characterName: '大沢瑠璃乃', slotType: 'main', row: 2, col: 4 },
  { slotId: 17, characterName: '大沢瑠璃乃', slotType: 'side', row: 2, col: 5 },
];

/**
 * デッキタイプに応じたスロットマッピングを取得
 */
export function getDeckSlotMapping(deckType?: DeckType): DeckSlotMapping[] {
  if (!deckType) {
    return DECK_SLOT_MAPPING_105; // デフォルトは105期
  }

  switch (deckType) {
    case DeckType.TERM_103:
      return DECK_SLOT_MAPPING_103;
    case DeckType.TERM_104:
      return DECK_SLOT_MAPPING_104;
    case DeckType.TERM_105:
      return DECK_SLOT_MAPPING_105;
    case DeckType.TERM_105_FT_KOZUE:
      return DECK_SLOT_MAPPING_105_FT_KOZUE;
    case DeckType.TERM_105_FT_TSUZURI:
      return DECK_SLOT_MAPPING_105_FT_TSUZURI;
    case DeckType.TERM_105_FT_MEGUMI:
      return DECK_SLOT_MAPPING_105_FT_MEGUMI;
    default:
      return DECK_SLOT_MAPPING_105;
  }
}

/**
 * デッキタイプに応じたキャラクターフレーム（表示順）を取得
 */
export function getDeckFrame(deckType?: DeckType): (CharacterName | 'フリー')[] {
  if (!deckType) {
    return ['セラス', '桂城泉', 'フリー', '百生吟子', '徒町小鈴', '安養寺姫芽', '日野下花帆', '村野さやか', '大沢瑠璃乃'];
  }

  switch (deckType) {
    case DeckType.TERM_103:
      return ['日野下花帆', '村野さやか', '大沢瑠璃乃', '乙宗梢', '夕霧綴理', '藤島慈'];
    case DeckType.TERM_104:
      return ['百生吟子', '徒町小鈴', '安養寺姫芽', '日野下花帆', '村野さやか', '大沢瑠璃乃', '乙宗梢', '夕霧綴理', '藤島慈'];
    case DeckType.TERM_105:
      return ['セラス', '桂城泉', 'フリー', '百生吟子', '徒町小鈴', '安養寺姫芽', '日野下花帆', '村野さやか', '大沢瑠璃乃'];
    case DeckType.TERM_105_FT_KOZUE:
      return ['乙宗梢', 'セラス', '桂城泉', '百生吟子', '徒町小鈴', '安養寺姫芽', '日野下花帆', '村野さやか', '大沢瑠璃乃'];
    case DeckType.TERM_105_FT_TSUZURI:
      return ['夕霧綴理', 'セラス', '桂城泉', '百生吟子', '徒町小鈴', '安養寺姫芽', '日野下花帆', '村野さやか', '大沢瑠璃乃'];
    case DeckType.TERM_105_FT_MEGUMI:
      return ['藤島慈', 'セラス', '桂城泉', '百生吟子', '徒町小鈴', '安養寺姫芽', '日野下花帆', '村野さやか', '大沢瑠璃乃'];
    default:
      return ['セラス', '桂城泉', 'フリー', '百生吟子', '徒町小鈴', '安養寺姫芽', '日野下花帆', '村野さやか', '大沢瑠璃乃'];
  }
}
