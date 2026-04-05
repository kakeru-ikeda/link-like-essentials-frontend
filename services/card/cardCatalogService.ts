import { fetchCardsByIds } from '@/repositories/sanity/cardRepository';
import { Card } from '@/models/card/Card';

/**
 * カードカタログ取得用サービス
 */
export const cardCatalogService = {
  async getCardsByIds(ids: string[]): Promise<Card[]> {
    const uniqueIds = Array.from(new Set(ids.filter(Boolean)));
    if (uniqueIds.length === 0) return [];
    return fetchCardsByIds(uniqueIds);
  },
};
