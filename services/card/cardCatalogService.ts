import { apolloClient } from '@/repositories/graphql/client';
import { GET_CARD_DETAILS } from '@/repositories/graphql/queries/cards';
import { CardDetailNode, CardDetailsQueryData } from '@/types/graphql/cards';
import { Card } from '@/models/domain/Card';

/**
 * カードカタログ取得用サービス
 */
export const cardCatalogService = {
  async getCardsByIds(ids: string[]): Promise<Card[]> {
    const uniqueIds = Array.from(new Set(ids.filter(Boolean)));
    if (uniqueIds.length === 0) return [];

    const { data } = await apolloClient.query<CardDetailsQueryData>({
      query: GET_CARD_DETAILS,
      variables: { cardIds: uniqueIds },
      fetchPolicy: 'cache-first',
    });

    if (!data || !data.cardDetails) {
      return [];
    }

    return data.cardDetails
      .map(cardCatalogService.mapDetailToCard)
      .filter((card): card is Card => Boolean(card));
  },

  mapDetailToCard(detail: CardDetailNode): Card | null {
    if (!detail.card) return null;

    const accessories = (detail.card.accessories ?? detail.accessories ?? []).map((accessory) => ({
      ...accessory,
      cardId: Number(accessory.cardId),
    }));

    return {
      ...detail.card,
      accessories,
      detail: {
        id: detail.id,
        cardId: Number(detail.cardId),
        favoriteMode: detail.favoriteMode ?? '',
        acquisitionMethod: detail.acquisitionMethod ?? '',
        awakeBeforeStorageUrl: detail.awakeBeforeStorageUrl ?? undefined,
        awakeAfterStorageUrl: detail.awakeAfterStorageUrl ?? undefined,
        stats: detail.stats,
        specialAppeal: detail.specialAppeal ?? undefined,
        skill: detail.skill ?? undefined,
        trait: detail.trait ?? undefined,
        accessories,
      },
    };
  },
};
