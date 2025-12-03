import { CharacterName } from '@/constants/characters';

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

export const DECK_SLOT_MAPPING: DeckSlotMapping[] = [
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
