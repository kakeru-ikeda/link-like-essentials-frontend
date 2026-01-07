import { DeckType } from '@/models/enums';
import { CharacterName } from '@/config/characters';
import {
  DeckSlotMapping,
  DECK_SLOT_MAPPING_103,
  DECK_SLOT_MAPPING_104,
  DECK_SLOT_MAPPING_105,
  DECK_SLOT_MAPPING_105_FT_KOZUE,
  DECK_SLOT_MAPPING_105_FT_TSUZURI,
  DECK_SLOT_MAPPING_105_FT_MEGUMI,
} from '@/config/deckSlots';

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
export function getDeckFrame(deckType?: DeckType): (CharacterName | 'フリー' | 'フレンド')[] {
  if (!deckType) {
    return ['セラス', '桂城泉', 'フリー', 'フレンド', '百生吟子', '徒町小鈴', '安養寺姫芽', '日野下花帆', '村野さやか', '大沢瑠璃乃'];
  }

  switch (deckType) {
    case DeckType.TERM_103:
      return ['日野下花帆', '村野さやか', '大沢瑠璃乃', 'フレンド', '乙宗梢', '夕霧綴理', '藤島慈'];
    case DeckType.TERM_104:
      return ['百生吟子', '徒町小鈴', '安養寺姫芽', 'フレンド', '日野下花帆', '村野さやか', '大沢瑠璃乃', '乙宗梢', '夕霧綴理', '藤島慈'];
    case DeckType.TERM_105:
      return ['セラス', '桂城泉', 'フリー', 'フレンド', '百生吟子', '徒町小鈴', '安養寺姫芽', '日野下花帆', '村野さやか', '大沢瑠璃乃'];
    case DeckType.TERM_105_FT_KOZUE:
      return ['乙宗梢', 'セラス', '桂城泉', 'フレンド', '百生吟子', '徒町小鈴', '安養寺姫芽', '日野下花帆', '村野さやか', '大沢瑠璃乃'];
    case DeckType.TERM_105_FT_TSUZURI:
      return ['夕霧綴理', 'セラス', '桂城泉', 'フレンド', '百生吟子', '徒町小鈴', '安養寺姫芽', '日野下花帆', '村野さやか', '大沢瑠璃乃'];
    case DeckType.TERM_105_FT_MEGUMI:
      return ['藤島慈', 'セラス', '桂城泉', 'フレンド', '百生吟子', '徒町小鈴', '安養寺姫芽', '日野下花帆', '村野さやか', '大沢瑠璃乃'];
    default:
      return ['セラス', '桂城泉', 'フリー', 'フレンド', '百生吟子', '徒町小鈴', '安養寺姫芽', '日野下花帆', '村野さやか', '大沢瑠璃乃'];
  }
}
