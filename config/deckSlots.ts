import { CharacterName } from '@/config/characters';

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
  // 上段（105期生 + フレンド）
  { slotId: 0, characterName: 'セラス', slotType: 'main', row: 0, col: 1 },
  { slotId: 1, characterName: 'セラス', slotType: 'side', row: 0, col: 2 },
  { slotId: 2, characterName: '桂城泉', slotType: 'main', row: 0, col: 3 },
  { slotId: 3, characterName: '桂城泉', slotType: 'side', row: 0, col: 4 },
  { slotId: 4, characterName: 'フリー', slotType: 'main', row: 0, col: 5 },
  { slotId: 5, characterName: 'フリー', slotType: 'main', row: 0, col: 6 },
  { slotId: 99, characterName: 'フレンド', slotType: 'side', row: 0, col: 0 },

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
  // 上段（104期生 + フレンド）
  { slotId: 0, characterName: '百生吟子', slotType: 'main', row: 0, col: 1 },
  { slotId: 1, characterName: '百生吟子', slotType: 'side', row: 0, col: 2 },
  { slotId: 2, characterName: '徒町小鈴', slotType: 'main', row: 0, col: 3 },
  { slotId: 3, characterName: '徒町小鈴', slotType: 'side', row: 0, col: 4 },
  { slotId: 4, characterName: '安養寺姫芽', slotType: 'main', row: 0, col: 5 },
  { slotId: 5, characterName: '安養寺姫芽', slotType: 'side', row: 0, col: 6 },
  { slotId: 99, characterName: 'フレンド', slotType: 'main', row: 0, col: 0 },

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
  // 上段（103期生 + フレンド）
  { slotId: 0, characterName: '日野下花帆', slotType: 'main', row: 0, col: 1 },
  { slotId: 1, characterName: '日野下花帆', slotType: 'side', row: 0, col: 2 },
  { slotId: 2, characterName: '日野下花帆', slotType: 'side', row: 0, col: 3 },
  { slotId: 3, characterName: '村野さやか', slotType: 'main', row: 0, col: 4 },
  { slotId: 4, characterName: '村野さやか', slotType: 'side', row: 0, col: 5 },
  { slotId: 5, characterName: '村野さやか', slotType: 'side', row: 0, col: 6 },
  { slotId: 6, characterName: '大沢瑠璃乃', slotType: 'main', row: 0, col: 7 },
  { slotId: 7, characterName: '大沢瑠璃乃', slotType: 'side', row: 0, col: 8 },
  { slotId: 8, characterName: '大沢瑠璃乃', slotType: 'side', row: 0, col: 9 },
  { slotId: 99, characterName: 'フレンド', slotType: 'main', row: 0, col: 0 },

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
  // 上段（105期生ft.梢 + フレンド）
  { slotId: 0, characterName: '乙宗梢', slotType: 'main', row: 0, col: 1 },
  { slotId: 1, characterName: '乙宗梢', slotType: 'side', row: 0, col: 2 },
  { slotId: 2, characterName: 'セラス', slotType: 'main', row: 0, col: 3 },
  { slotId: 3, characterName: 'セラス', slotType: 'side', row: 0, col: 4 },
  { slotId: 4, characterName: '桂城泉', slotType: 'main', row: 0, col: 5 },
  { slotId: 5, characterName: '桂城泉', slotType: 'side', row: 0, col: 6 },
  { slotId: 99, characterName: 'フレンド', slotType: 'main', row: 0, col: 0 },

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
  // 上段（105期生ft.綴理 + フレンド）
  { slotId: 0, characterName: '夕霧綴理', slotType: 'main', row: 0, col: 1 },
  { slotId: 1, characterName: '夕霧綴理', slotType: 'side', row: 0, col: 2 },
  { slotId: 2, characterName: 'セラス', slotType: 'main', row: 0, col: 3 },
  { slotId: 3, characterName: 'セラス', slotType: 'side', row: 0, col: 4 },
  { slotId: 4, characterName: '桂城泉', slotType: 'main', row: 0, col: 5 },
  { slotId: 5, characterName: '桂城泉', slotType: 'side', row: 0, col: 6 },
  { slotId: 99, characterName: 'フレンド', slotType: 'main', row: 0, col: 0 },

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
  // 上段（105期生ft.慈 + フレンド）
  { slotId: 0, characterName: '藤島慈', slotType: 'main', row: 0, col: 1 },
  { slotId: 1, characterName: '藤島慈', slotType: 'side', row: 0, col: 2 },
  { slotId: 2, characterName: 'セラス', slotType: 'main', row: 0, col: 3 },
  { slotId: 3, characterName: 'セラス', slotType: 'side', row: 0, col: 4 },
  { slotId: 4, characterName: '桂城泉', slotType: 'main', row: 0, col: 5 },
  { slotId: 5, characterName: '桂城泉', slotType: 'side', row: 0, col: 6 },
  { slotId: 99, characterName: 'フレンド', slotType: 'main', row: 0, col: 0 },

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
