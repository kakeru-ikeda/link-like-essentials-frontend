import { Deck } from '@/models/Deck';
import { auth } from '@/repositories/firebase/config';

const FUNCTIONS_BASE_URL =
  process.env.NEXT_PUBLIC_FUNCTIONS_URL ||
  'https://asia-northeast1-link-like-essentials.cloudfunctions.net/deckApi';

async function getAuthToken(): Promise<string> {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('認証されていません');
  }
  return await user.getIdToken();
}

export const deckRepository = {
  async getDecks(params?: {
    limit?: number;
    orderBy?: 'createdAt' | 'updatedAt' | 'viewCount';
    order?: 'asc' | 'desc';
    userId?: string;
    songId?: string;
    tag?: string;
  }): Promise<Deck[]> {
    const token = await getAuthToken();
    const queryParams = new URLSearchParams();

    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.orderBy) queryParams.append('orderBy', params.orderBy);
    if (params?.order) queryParams.append('order', params.order);
    if (params?.userId) queryParams.append('userId', params.userId);
    if (params?.songId) queryParams.append('songId', params.songId);
    if (params?.tag) queryParams.append('tag', params.tag);

    const url = `${FUNCTIONS_BASE_URL}/decks${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error?.message || 'デッキ一覧の取得に失敗しました');
    }

    const data = await response.json();
    return data.decks;
  },

  async getDeck(deckId: string): Promise<Deck> {
    const token = await getAuthToken();
    const response = await fetch(`${FUNCTIONS_BASE_URL}/decks/${deckId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error?.message || 'デッキの取得に失敗しました');
    }

    const data = await response.json();
    return data.deck;
  },

  async createDeck(deck: Deck): Promise<Deck> {
    const token = await getAuthToken();
    const user = auth.currentUser;

    // クラウド送信用に必要最小限のデータのみを抽出
    const deckForCloud = {
      id: deck.id,
      name: deck.name,
      slots: deck.slots.map(slot => ({
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

    console.log('送信するデッキデータ:', deckForCloud);

    const response = await fetch(`${FUNCTIONS_BASE_URL}/decks`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ deck: deckForCloud }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      console.error('API エラーレスポンス:', error);
      throw new Error(error.error?.message || 'デッキの作成に失敗しました');
    }

    const data = await response.json();
    return data.deck;
  },

  async updateDeck(deckId: string, deck: Partial<Deck>): Promise<Deck> {
    const token = await getAuthToken();
    
    // クラウド送信用に必要最小限のデータのみを抽出
    const deckForCloud: Record<string, any> = {};
    
    // 必要なフィールドのみをコピー
    if (deck.name !== undefined) deckForCloud.name = deck.name;
    if (deck.aceSlotId !== undefined) deckForCloud.aceSlotId = deck.aceSlotId;
    if (deck.deckType !== undefined) deckForCloud.deckType = deck.deckType;
    if (deck.songId !== undefined) deckForCloud.songId = deck.songId;
    if (deck.memo !== undefined) deckForCloud.memo = deck.memo;
    if (deck.updatedAt !== undefined) deckForCloud.updatedAt = deck.updatedAt;
    
    // slotsは特別処理
    if (deck.slots) {
      deckForCloud.slots = deck.slots.map(slot => ({
        slotId: slot.slotId,
        cardId: slot.cardId,
        ...(slot.limitBreak && { limitBreak: slot.limitBreak }),
      }));
    }
    
    const response = await fetch(`${FUNCTIONS_BASE_URL}/decks/${deckId}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ deck: deckForCloud }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error?.message || 'デッキの更新に失敗しました');
    }

    const data = await response.json();
    return data.deck;
  },

  async deleteDeck(deckId: string): Promise<void> {
    const token = await getAuthToken();
    const response = await fetch(`${FUNCTIONS_BASE_URL}/decks/${deckId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error?.message || 'デッキの削除に失敗しました');
    }
  },
};
