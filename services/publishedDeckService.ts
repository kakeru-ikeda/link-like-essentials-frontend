import { GetDecksParams } from '@/models/DeckQueryParams';
import { PublishedDeck } from '@/models/PublishedDeck';
import { PaginatedResponse } from '@/models/Pagination';
import { PopularHashtagSummary } from '@/models/Hashtag';
import { deckRepository } from '@/repositories/api/deckRepository';

/**
 * 公開デッキの取得・操作をまとめたサービス
 */
export const publishedDeckService = {
  async getDecks(params?: GetDecksParams): Promise<PaginatedResponse<PublishedDeck>> {
    return deckRepository.getDecks(params);
  },

  async getDeck(deckId: string): Promise<PublishedDeck> {
    return deckRepository.getDeck(deckId);
  },

  async likeDeck(deckId: string): Promise<number> {
    return deckRepository.likeDeck(deckId);
  },

  async unlikeDeck(deckId: string): Promise<number> {
    return deckRepository.unlikeDeck(deckId);
  },

  async incrementViewCount(deckId: string): Promise<number> {
    return deckRepository.incrementViewCount(deckId);
  },

  async getPopularHashtags(): Promise<PopularHashtagSummary> {
    return deckRepository.getPopularHashtags();
  },
};
