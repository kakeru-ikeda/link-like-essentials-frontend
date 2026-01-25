import { GetDecksParams, GetLikedDecksParams } from '@/models/domain/DeckQueryParams';
import { PublishedDeck } from '@/models/domain/PublishedDeck';
import { Comment } from '@/models/domain/Comment';
import { PaginatedResponse } from '@/models/shared/Pagination';
import { PopularHashtagSummary } from '@/models/features/Hashtag';
import { deckRepository } from '@/repositories/api/deckRepository';
import { ReportReason } from '@/models/domain/Comment';

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

  async reportDeck(deckId: string, reason: ReportReason, details?: string): Promise<{ success: boolean; message: string }> {
    return deckRepository.reportDeck(deckId, reason, details);
  },

  async deleteDeck(deckId: string): Promise<void> {
    return deckRepository.deleteDeck(deckId);
  },
};
