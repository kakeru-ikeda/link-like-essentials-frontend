import { Deck } from '@/models/Deck';
import { deckRepository } from '@/repositories/api/deckRepository';

/**
 * デッキのクラウド保存サービス
 * ビジネスロジックを担当
 */
export const deckCloudService = {
  /**
   * デッキをクラウドに保存
   * 既存のデッキ（userIdとidが一致）があれば更新、なければ新規作成
   */
  async saveDeckToCloud(deck: Deck): Promise<Deck> {
    // 既にuserIdが設定されていれば更新、なければ新規作成
    if (deck.userId) {
      // 更新
      console.log('Updating deck in cloud:', deck.id);
      
      return await deckRepository.updateDeck(deck.id, deck);
    } else {
      // 新規作成
      console.log('Creating new deck in cloud');
      return await deckRepository.createDeck(deck);
    }
  },

  /**
   * クラウドからデッキ一覧を取得
   */
  async loadDecksFromCloud(params?: {
    limit?: number;
    orderBy?: 'createdAt' | 'updatedAt' | 'viewCount';
    order?: 'asc' | 'desc';
    userId?: string;
    songId?: string;
    tag?: string;
  }): Promise<Deck[]> {
    return await deckRepository.getDecks(params);
  },

  /**
   * クラウドから特定のデッキを取得
   */
  async loadDeckFromCloud(deckId: string): Promise<Deck> {
    return await deckRepository.getDeck(deckId);
  },

  /**
   * クラウドからデッキを削除
   */
  async deleteDeckFromCloud(deckId: string): Promise<void> {
    await deckRepository.deleteDeck(deckId);
  },
};
