import { Accessory, Card, Skill, Stats, Trait } from '@/models/card/Card';

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
  cardDetails: CardDetailNode[];
}

export interface CardDetailNode {
  id: string;
  cardId: string;
  favoriteMode?: string | null;
  acquisitionMethod?: string | null;
  awakeBeforeStorageUrl?: string | null;
  awakeAfterStorageUrl?: string | null;
  stats: Stats;
  specialAppeal?: Skill | null;
  skill?: Skill | null;
  trait?: Trait | null;
  accessories: Accessory[];
  card: (Card & { accessories?: Accessory[] }) | null;
}
