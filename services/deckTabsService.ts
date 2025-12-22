import { Deck } from '@/models/Deck';
import { DeckType } from '@/models/enums';
import { getDeckSlotMapping } from '@/constants/deckConfig';

/**
 * デッキタブの永続化データ構造
 */
interface DeckTabsData {
  tabs: Deck[];
  activeTabId: string;
}

const STORAGE_KEY_TABS = 'deckTabs';

/**
 * デッキタブ管理サービス
 * LocalStorageへの永続化を担当
 */
export class DeckTabsService {
  /**
   * 空のデッキを作成
   */
  static createEmptyDeck(deckType: DeckType = DeckType.TERM_105): Deck {
    const mapping = getDeckSlotMapping(deckType);
    const slots = mapping.map((m) => ({
      slotId: m.slotId,
      characterName: m.characterName,
      cardId: null,
    }));

    return {
      id: crypto.randomUUID(),
      name: '新しいデッキ',
      slots,
      aceSlotId: null,
      deckType,
      memo: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  /**
   * LocalStorageからタブ情報を読み込み
   */
  static loadTabsFromLocal(): DeckTabsData {
    if (typeof window === 'undefined') {
      const initialDeck = this.createEmptyDeck();
      return {
        tabs: [initialDeck],
        activeTabId: initialDeck.id,
      };
    }

    const saved = localStorage.getItem(STORAGE_KEY_TABS);
    
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const tabs = parsed.tabs ?? [];
        const activeTabId = parsed.activeTabId ?? '';

        // タブが空の場合は初期タブを作成
        if (tabs.length === 0) {
          const initialDeck = this.createEmptyDeck();
          return {
            tabs: [initialDeck],
            activeTabId: initialDeck.id,
          };
        }

        return { tabs, activeTabId };
      } catch (error) {
        console.error('Failed to load deck tabs:', error);
        const initialDeck = this.createEmptyDeck();
        return {
          tabs: [initialDeck],
          activeTabId: initialDeck.id,
        };
      }
    }

    // デフォルト: 初期タブを作成
    const initialDeck = this.createEmptyDeck();
    return {
      tabs: [initialDeck],
      activeTabId: initialDeck.id,
    };
  }

  /**
   * LocalStorageにタブ情報を保存
   */
  static saveTabsToLocal(data: DeckTabsData): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(STORAGE_KEY_TABS, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save deck tabs:', error);
    }
  }

  /**
   * タブ配列からナンバリングされたデッキ名を生成
   */
  static generateDeckName(currentTabsCount: number): string {
    return `デッキ${currentTabsCount + 1}`;
  }
}
