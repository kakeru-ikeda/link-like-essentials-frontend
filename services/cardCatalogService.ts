import { apolloClient } from '@/repositories/graphql/client';
import { GET_CARD_DETAILS } from '@/repositories/graphql/queries/cards';
import { Card } from '@/models/Card';

interface GetCardDetailsResponse {
  cardDetails: Array<{
    id: string;
    cardId: string;
    card: Card;
  }>;
}

/**
 * カードカタログ取得用サービス
 */
export const cardCatalogService = {
  async getCardsByIds(ids: string[]): Promise<Card[]> {
    const uniqueIds = Array.from(new Set(ids.filter(Boolean)));
    if (uniqueIds.length === 0) return [];

    const { data } = await apolloClient.query<GetCardDetailsResponse>({
      query: GET_CARD_DETAILS,
      variables: { cardIds: uniqueIds },
      fetchPolicy: 'cache-first',
    });

    return data.cardDetails
      .map((detail) => detail.card)
      .filter((card): card is Card => Boolean(card));
  },
};
