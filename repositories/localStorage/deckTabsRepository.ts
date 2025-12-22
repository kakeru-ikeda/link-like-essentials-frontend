import { Deck } from '@/models/Deck';

const STORAGE_KEY_TABS = 'deckTabs';

/**
 * デッキタブの永続化データ構造
 */
export interface DeckTabsData {
  tabs: Deck[];
  activeTabId: string;
}

/**
 * デッキタブのLocalStorage操作を担当するリポジトリ
 */
export class DeckTabsRepository {
  /**
   * LocalStorageからタブ情報を読み込み
   */
  static loadTabs(): DeckTabsData | null {
    if (typeof window === 'undefined') return null;

    try {
      const saved = localStorage.getItem(STORAGE_KEY_TABS);
      if (saved) {
        const parsed = JSON.parse(saved);
        const tabs = parsed.tabs ?? [];
        const activeTabId = parsed.activeTabId ?? '';

        // タブが空の場合はnullを返す（サービス層で初期化処理を行う）
        if (tabs.length === 0) {
          return null;
        }

        return { tabs, activeTabId };
      }
      return null;
    } catch (error) {
      console.error('Failed to load deck tabs:', error);
      return null;
    }
  }

  /**
   * LocalStorageにタブ情報を保存
   */
  static saveTabs(data: DeckTabsData): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(STORAGE_KEY_TABS, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save deck tabs:', error);
    }
  }
}
