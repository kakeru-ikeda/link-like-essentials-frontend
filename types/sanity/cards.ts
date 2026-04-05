/**
 * Sanity から取得するカードドキュメントの型定義
 * models/card/Card.ts に対応するが、Sanity 固有フィールド（_id 等）を含む
 */

import type { DeckType, FavoriteMode } from '@/models/shared/enums';

export interface SanitySkill {
  name?: string;
  ap?: string;
  effect?: string;
}

export interface SanityTrait {
  name?: string;
  effect?: string;
}

export interface SanityToken {
  _key: string;
  parentType?: string;
  name?: string;
  ap?: string;
  effect?: string;
  traitName?: string;
  traitEffect?: string;
}

export interface SanityStats {
  smile?: number;
  pure?: number;
  cool?: number;
  mental?: number;
}

export interface SanitySidePlacementRule {
  _key?: string;
  characters?: string[];
  deckTypes?: DeckType;
}

export interface SanityCard {
  _id: string;
  _createdAt: string;
  _updatedAt: string;
  cardName?: string;
  characterName?: string[];
  rarity?: string;
  styleType?: string;
  limited?: string;
  releaseDate?: string;
  favoriteMode?: FavoriteMode;
  acquisitionMethod?: string;
  awakeBeforeImage?: string;
  awakeAfterImage?: string;
  stats?: SanityStats;
  specialAppeal?: SanitySkill;
  skill?: SanitySkill;
  trait?: SanityTrait;
  tokens?: SanityToken[];
  sidePlacementRules?: SanitySidePlacementRule[];
}
