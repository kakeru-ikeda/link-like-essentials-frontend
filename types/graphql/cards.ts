import { Card } from '@/models/Card';

/**
 * GraphQLクエリのレスポンス型定義
 */

export interface CardsQueryData {
  cards: Card[];
}

export interface CardDetailQueryData {
  card: Card;
}

export interface CardDetailsQueryData {
  cardDetails: Array<{
    id: string;
    cardId: string;
    card: Card;
  }>;
}
