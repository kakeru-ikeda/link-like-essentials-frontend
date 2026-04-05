import { DeckType, FavoriteMode, LimitedType, Rarity, StyleType } from '@/models/shared/enums';

export interface Stats {
  smile: number;
  pure: number;
  cool: number;
  mental: number;
}

export interface Skill {
  name: string;
  ap?: string;
  effect?: string;
}

export interface Trait {
  name: string;
  effect?: string;
}

export interface SidePlacementRule {
  characters: string[];
  deckTypes?: DeckType;
}

export interface Token {
  id: string;
  cardId: number;
  parentType: string;
  name: string;
  ap?: string;
  effect?: string;
  traitName?: string;
  traitEffect?: string;
}

export interface Card {
  id: string;
  rarity: Rarity;
  limited: LimitedType;
  cardName: string;
  cardUrl: string;
  characterName: string[];
  styleType: StyleType;
  releaseDate: string;
  isLocked: boolean;
  createdAt: string;
  updatedAt: string;
  favoriteMode?: FavoriteMode;
  acquisitionMethod?: string;
  awakeBeforeImage?: string;
  awakeAfterImage?: string;
  stats?: Stats;
  specialAppeal?: Skill;
  skill?: Skill;
  trait?: Trait;
  tokens: Token[];
  sidePlacementRules?: SidePlacementRule[];
}
