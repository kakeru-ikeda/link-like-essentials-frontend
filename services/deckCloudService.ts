import { Deck, DeckForCloud, DeckForCloudUpdate, DeckSlotForCloud } from '@/models/Deck';
import { deckRepository } from '@/repositories/api/deckRepository';
import { auth } from '@/repositories/firebase/config';

/**
 * Deckをクラウド送信用の形式に変換
 */
function convertToDeckForCloud(deck: Deck): DeckForCloud {
  const user = auth.currentUser;
  
  return {
    id: deck.id,
    name: deck.name,
    slots: deck.slots.map((slot): DeckSlotForCloud => ({
      slotId: slot.slotId,
      cardId: slot.cardId,
      ...(slot.limitBreak && { limitBreak: slot.limitBreak }),
    })),
    aceSlotId: deck.aceSlotId,
    deckType: deck.deckType,
    songId: deck.songId,
    memo: deck.memo,
    createdAt: deck.createdAt,
    updatedAt: deck.updatedAt,
    userId: user?.uid,
  };
}

/**
 * Partial<Deck>をクラウド更新用の形式に変換
 */
function convertToDeckForCloudUpdate(deck: Partial<Deck>): DeckForCloudUpdate {
  return {
    ...(deck.name !== undefined && { name: deck.name }),
    ...(deck.aceSlotId !== undefined && { aceSlotId: deck.aceSlotId }),
    ...(deck.deckType !== undefined && { deckType: deck.deckType }),
    ...(deck.songId !== undefined && { songId: deck.songId }),
    ...(deck.memo !== undefined && { memo: deck.memo }),
    ...(deck.updatedAt !== undefined && { updatedAt: deck.updatedAt }),
    ...(deck.slots && {
      slots: deck.slots.map((slot): DeckSlotForCloud => ({
        slotId: slot.slotId,
        cardId: slot.cardId,
        ...(slot.limitBreak && { limitBreak: slot.limitBreak }),
      })),
    }),
  };
}

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
    // 既にクラウドに存在するデッキかどうかを判定
    if (deck.userId === auth.currentUser?.uid) {
      // 更新
      const deckForCloud = convertToDeckForCloudUpdate(deck);
      return await deckRepository.updateDeck(deck.id, deckForCloud);
    } else {
      // 新規作成
      const deckForCloud = convertToDeckForCloud(deck);
      return await deckRepository.createDeck(deckForCloud);
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
