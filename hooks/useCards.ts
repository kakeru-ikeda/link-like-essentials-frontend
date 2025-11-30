import { useQuery } from '@apollo/client';
import { GET_CARDS, GET_CARD_DETAIL } from '@/repositories/graphql/queries/cards';
import { Card } from '@/models/Card';
import { CardFilter } from '@/models/Filter';
import { filterCardsOnClient } from '@/services/cardFilterService';

interface CardsQueryData {
  cards: Card[];
}

interface CardDetailQueryData {
  card: Card;
}

/**
 * カード一覧を取得するフック
 * クライアントサイドフィルタリングを使用
 * 
 * @param filter カードフィルター（省略時は全件取得）
 * @param skip クエリをスキップするかどうか
 * @returns カード配列、ローディング状態、エラーメッセージ
 */
export const useCards = (filter?: CardFilter, skip?: boolean) => {
  // 全件取得（filterパラメータなし）
  const { data, loading, error } = useQuery<CardsQueryData>(GET_CARDS, {
    skip,
  });

  const allCards = data?.cards ?? [];

  // クライアントサイドフィルタリング
  const filteredCards = filter ? filterCardsOnClient(allCards, filter) : allCards;

  return {
    cards: filteredCards,
    loading,
    error: error?.message,
  };
};

/**
 * カード詳細を取得するフック
 * 
 * @param id カードID
 * @returns カード詳細、ローディング状態、エラーメッセージ
 */
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
