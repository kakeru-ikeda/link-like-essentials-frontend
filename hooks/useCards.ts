import { useQuery } from '@apollo/client';
import { GET_CARDS, GET_CARD_DETAIL } from '@/repositories/graphql/queries/cards';
import { Card } from '@/models/Card';
import { CardFilters } from '@/store/cardStore';

interface CardsQueryVariables {
  first?: number;
  after?: string;
  filter?: CardFilters;
}

interface CardsQueryData {
  cards: {
    edges: Array<{
      node: Card;
    }>;
    pageInfo: {
      hasNextPage: boolean;
      endCursor: string;
    };
    totalCount: number;
  };
}

interface CardDetailQueryData {
  card: Card;
}

export const useCards = (filter?: CardFilters, first: number = 20) => {
  const { data, loading, error, fetchMore } = useQuery<
    CardsQueryData,
    CardsQueryVariables
  >(GET_CARDS, {
    variables: { first, filter },
  });

  const loadMore = (): void => {
    if (data?.cards.pageInfo.hasNextPage) {
      fetchMore({
        variables: {
          after: data.cards.pageInfo.endCursor,
        },
      });
    }
  };

  return {
    cards: data?.cards.edges.map((edge) => edge.node) ?? [],
    hasNextPage: data?.cards.pageInfo.hasNextPage ?? false,
    totalCount: data?.cards.totalCount ?? 0,
    loading,
    error: error?.message,
    loadMore,
  };
};

export const useCardDetail = (id: string) => {
  const { data, loading, error } = useQuery<
    CardDetailQueryData,
    { id: string }
  >(GET_CARD_DETAIL, {
    variables: { id },
    skip: !id,
  });

  return {
    card: data?.card,
    loading,
    error: error?.message,
  };
};
