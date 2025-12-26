import { Deck, DeckForCloud, DeckForCloudUpdate } from '@/models/Deck';
import { DECK_API_ENDPOINT } from '@/constants/apiEndpoints';
import { getAuthToken } from './authUtils';

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

    const url = `${DECK_API_ENDPOINT}/decks${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

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
    const response = await fetch(`${DECK_API_ENDPOINT}/decks/${deckId}`, {
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

  async createDeck(deckForCloud: DeckForCloud): Promise<Deck> {
    const token = await getAuthToken();

    const response = await fetch(`${DECK_API_ENDPOINT}/decks`, {
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

  async updateDeck(deckId: string, deckForCloud: DeckForCloudUpdate): Promise<Deck> {
    const token = await getAuthToken();
    
    const response = await fetch(`${DECK_API_ENDPOINT}/decks/${deckId}`, {
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
    const response = await fetch(`${DECK_API_ENDPOINT}/decks/${deckId}`, {
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
