import { Deck } from '@/models/deck/Deck';

const STORAGE_KEY_DECK = 'deck';

/**
 * デッキのLocalStorage操作を担当するリポジトリ
 */
export class DeckRepository {
  /**
   * デッキをLocalStorageに保存
   */
  static saveDeck(deck: Deck): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(STORAGE_KEY_DECK, JSON.stringify(deck));
    } catch (error) {
      console.error('Failed to save deck:', error);
    }
  }

  /**
   * LocalStorageからデッキを読み込み
   */
  static loadDeck(): Deck | null {
    if (typeof window === 'undefined') return null;

    try {
      const saved = localStorage.getItem(STORAGE_KEY_DECK);
      if (saved) {
        return JSON.parse(saved);
      }
      return null;
    } catch (error) {
      console.error('Failed to load deck:', error);
      return null;
    }
  }
}
