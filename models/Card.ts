import { Rarity, StyleType, LimitedType } from './enums';

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

export interface Accessory {
  id: string;
  cardId: number;
  parentType: string;
  name: string;
  ap?: string;
  effect?: string;
  traitName?: string;
  traitEffect?: string;
}

export interface CardDetail {
  id: string;
  cardId: number;
  favoriteMode: string;
  acquisitionMethod: string;
  stats: Stats;
  specialAppeal?: Skill;
  skill?: Skill;
  trait?: Trait;
  accessories: Accessory[];
}

export interface Card {
  id: string;
  rarity: Rarity;
  limited: LimitedType;
  cardName: string;
  cardUrl: string;
  characterName: string;
  styleType: StyleType;
  isLocked: boolean;
  createdAt: string;
  updatedAt: string;
  detail?: CardDetail;
  accessories: Accessory[];
}
