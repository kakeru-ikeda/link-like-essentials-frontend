import { GetDecksParams, GetLikedDecksParams } from '@/models/DeckQueryParams';
import { PublishedDeck } from '@/models/PublishedDeck';
import { Comment } from '@/models/Comment';
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

  async getMyDecks(params?: GetDecksParams): Promise<PaginatedResponse<PublishedDeck>> {
    return deckRepository.getMyDecks(params);
  },

  async getLikedDecks(params?: GetLikedDecksParams): Promise<PaginatedResponse<PublishedDeck>> {
    return deckRepository.getLikedDecks(params);
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

  async postComment(deckId: string, text: string): Promise<Comment> {
    return deckRepository.postComment(deckId, text);
  },

  async getComments(deckId: string, page?: number, perPage?: number): Promise<PaginatedResponse<Comment>> {
    return deckRepository.getComments(deckId, page, perPage);
  },

  async getPopularHashtags(): Promise<PopularHashtagSummary> {
    return deckRepository.getPopularHashtags();
  },
};
