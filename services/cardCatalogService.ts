import { apolloClient } from '@/repositories/graphql/client';
import { GET_CARD_DETAIL } from '@/repositories/graphql/queries/cards';
import { Card } from '@/models/Card';

interface GetCardDetailResponse {
  card: Card;
}

/**
 * カードカタログ取得用サービス
 */
export const cardCatalogService = {
  async getCardsByIds(ids: string[]): Promise<Card[]> {
    const uniqueIds = Array.from(new Set(ids.filter(Boolean)));
    if (uniqueIds.length === 0) return [];

    const results = await Promise.all(
      uniqueIds.map((id) =>
        apolloClient.query<GetCardDetailResponse>({
          query: GET_CARD_DETAIL,
          variables: { id },
          fetchPolicy: 'cache-first',
        })
      )
    );

    return results
      .map((res) => res.data.card)
      .filter((card): card is Card => Boolean(card));
  },
};
