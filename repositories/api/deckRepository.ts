import { DeckPublicationRequest, PublishedDeck } from '@/models/PublishedDeck';
import { Comment } from '@/models/Comment';
import { GetDecksParams } from '@/models/DeckQueryParams';
import { PaginatedResponse } from '@/models/Pagination';
import { DECK_API_ENDPOINT } from '@/constants/apiEndpoints';
import { getAuthToken } from './authUtils';

export const deckRepository = {
  /**
   * 公開デッキ一覧を取得（ページネーション対応）
   * @param params - クエリパラメータ
   * @returns ページネーション付き公開デッキ配列
   */
  async getDecks(params?: GetDecksParams): Promise<PaginatedResponse<PublishedDeck>> {
    const token = await getAuthToken();
    const queryParams = new URLSearchParams();

    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.perPage) queryParams.append('perPage', params.perPage.toString());
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
    return {
      data: data.publishedDecks,
      pageInfo: data.pageInfo,
    };
  },

  /**
   * 公開デッキを1件取得
   * @param deckId - デッキID
   * @returns 公開デッキ
   */
  async getDeck(deckId: string): Promise<PublishedDeck> {
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
    return data.publishedDeck;
  },

  /**
   * 公開デッキを削除
   * @param deckId - デッキID（公開ID）
   */
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

  /**
   * デッキを公開する
   * @param publication - 公開リクエストデータ（id, deck, comment, hashtags, imageUrls）
   * @returns 公開済みデッキ
   */
  async publishDeck(publication: DeckPublicationRequest): Promise<PublishedDeck> {
    const token = await getAuthToken();

    const response = await fetch(`${DECK_API_ENDPOINT}/decks/publish`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(publication),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error?.message || 'デッキの公開に失敗しました');
    }

    const data = await response.json();
    return data.publishedDeck;
  },

  /**
   * デッキにいいねする
   * @param deckId - デッキID（公開ID）
   * @returns 更新後のいいね数
   */
  async likeDeck(deckId: string): Promise<number> {
    const token = await getAuthToken();
    const response = await fetch(`${DECK_API_ENDPOINT}/decks/${deckId}/like`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error?.message || 'いいねに失敗しました');
    }

    const data = await response.json();
    return data.likeCount;
  },

  /**
   * デッキのいいねを取り消す
   * @param deckId - デッキID（公開ID）
   * @returns 更新後のいいね数
   */
  async unlikeDeck(deckId: string): Promise<number> {
    const token = await getAuthToken();
    const response = await fetch(`${DECK_API_ENDPOINT}/decks/${deckId}/like`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error?.message || 'いいね取り消しに失敗しました');
    }

    const data = await response.json();
    return data.likeCount;
  },

  /**
   * 閲覧数をカウント
   * @param deckId - デッキID（公開ID）
   * @returns 更新後の閲覧数
   */
  async incrementViewCount(deckId: string): Promise<number> {
    const token = await getAuthToken();
    const response = await fetch(`${DECK_API_ENDPOINT}/decks/${deckId}/view`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error?.message || '閲覧数の更新に失敗しました');
    }

    const data = await response.json();
    return data.viewCount;
  },

  /**
   * デッキにコメントする
   * @param deckId - デッキID（公開ID）
   * @param text - コメント本文
   * @returns 投稿されたコメント
   */
  async postComment(deckId: string, text: string): Promise<Comment> {
    const token = await getAuthToken();
    const response = await fetch(`${DECK_API_ENDPOINT}/decks/${deckId}/comments`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error?.message || 'コメントの投稿に失敗しました');
    }

    const data = await response.json();
    return data.comment;
  },

  /**
   * デッキを通報する
   * @param deckId - デッキID（公開ID）
   * @param reason - 通報理由
   * @param details - 詳細（任意）
   * @returns 通報結果
   */
  async reportDeck(
    deckId: string,
    reason: 'inappropriate_content' | 'spam' | 'copyright' | 'other',
    details?: string
  ): Promise<{ success: boolean; message: string }> {
    const token = await getAuthToken();
    const response = await fetch(`${DECK_API_ENDPOINT}/decks/${deckId}/report`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ reason, details }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error?.message || '通報に失敗しました');
    }

    const data = await response.json();
    return data;
  },
};
