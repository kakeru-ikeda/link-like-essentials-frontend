import { Deck } from '@/models/Deck';
import { DeckType } from '@/models/enums';
import { getDeckSlotMapping } from '@/constants/deckConfig';

/**
 * デッキタブ管理サービス
 * デッキ作成などのビジネスロジックを担当
 */
export class DeckTabsService {
  /**
   * 空のデッキを作成
   */
  static createEmptyDeck(
    name: string = '新しいデッキ',
    deckType: DeckType = DeckType.TERM_105
  ): Deck {
    const mapping = getDeckSlotMapping(deckType);
    const slots = mapping.map((m) => ({
      slotId: m.slotId,
      characterName: m.characterName,
      cardId: null,
    }));

    return {
      id: crypto.randomUUID(),
      name,
      slots,
      aceSlotId: null,
      deckType,
      memo: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  /**
   * タブ配列からナンバリングされたデッキ名を生成
   */
  static generateDeckName(currentTabsCount: number): string {
    return `デッキ${currentTabsCount + 1}`;
  }
}
