import { CharacterName } from '@/constants/characters';

export const DECK_SLOT_COUNT = 18;

export interface DeckSlotMapping {
  slotId: number;
  characterName: CharacterName;
  row: number;
  col: number;
}

export const DECK_SLOT_MAPPING: DeckSlotMapping[] = [
  // 上段
  { slotId: 0, characterName: 'セラス', row: 0, col: 0 },
  { slotId: 1, characterName: 'セラス', row: 0, col: 1 },
  { slotId: 2, characterName: '桂城泉', row: 0, col: 2 },
  { slotId: 3, characterName: '桂城泉', row: 0, col: 3 },
  { slotId: 4, characterName: 'フリー', row: 0, col: 4 },
  { slotId: 5, characterName: 'フリー', row: 0, col: 5 },

  // 中段
  { slotId: 6, characterName: '百生吟子', row: 1, col: 0 },
  { slotId: 7, characterName: '百生吟子', row: 1, col: 1 },
  { slotId: 8, characterName: '徒町小鈴', row: 1, col: 2 },
  { slotId: 9, characterName: '徒町小鈴', row: 1, col: 3 },
  { slotId: 10, characterName: '安養寺姫芽', row: 1, col: 4 },
  { slotId: 11, characterName: '安養寺姫芽', row: 1, col: 5 },

  // 下段
  { slotId: 12, characterName: '日野下花帆', row: 2, col: 0 },
  { slotId: 13, characterName: '日野下花帆', row: 2, col: 1 },
  { slotId: 14, characterName: '村野さやか', row: 2, col: 2 },
  { slotId: 15, characterName: '村野さやか', row: 2, col: 3 },
  { slotId: 16, characterName: '大沢瑠璃乃', row: 2, col: 4 },
  { slotId: 17, characterName: '大沢瑠璃乃', row: 2, col: 5 },
];
