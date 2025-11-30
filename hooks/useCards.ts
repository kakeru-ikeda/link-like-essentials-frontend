import { useQuery } from '@apollo/client';
import { GET_CARDS, GET_CARD_DETAIL } from '@/repositories/graphql/queries/cards';
import { Card } from '@/models/Card';
import { CardFilters } from '@/store/cardStore';

interface CardsQueryVariables {
  filter?: CardFilters;
}

interface CardsQueryData {
  cards: Card[];
}

interface CardDetailQueryData {
  card: Card;
}

export const useCards = (filter?: CardFilters, skip?: boolean) => {
  const { data, loading, error } = useQuery<
    CardsQueryData,
    CardsQueryVariables
  >(GET_CARDS, {
    variables: { filter },
    skip, // クエリをスキップするオプション
  });

  return {
    cards: data?.cards ?? [],
    loading,
    error: error?.message,
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
