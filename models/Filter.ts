import { Rarity, StyleType, LimitedType, FavoriteMode } from './enums';
import { SkillEffectType, SkillSearchTarget } from '@/constants/skillEffects';

export interface CardFilter {
  // キーワード検索
  keyword?: string;

  // レアリティ絞り込み
  rarities?: Rarity[];

  // スタイルタイプ絞り込み
  styleTypes?: StyleType[];

  // 入手方法絞り込み
  limitedTypes?: LimitedType[];

  // 得意ムード絞り込み
  favoriteModes?: FavoriteMode[];

  // キャラクター絞り込み
  characterNames?: string[];

  // スキル効果絞り込み
  skillEffects?: SkillEffectType[];

  // スキル検索対象（スペシャルアピール、スキル、特性）
  skillSearchTargets?: SkillSearchTarget[];
}

export enum SortField {
  CARD_NAME = 'CARD_NAME',
  CHARACTER_NAME = 'CHARACTER_NAME',
  RARITY = 'RARITY',
  CREATED_AT = 'CREATED_AT',
  UPDATED_AT = 'UPDATED_AT',
  SMILE = 'SMILE',
  PURE = 'PURE',
  COOL = 'COOL',
  MENTAL = 'MENTAL',
}

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export interface SortOption {
  field: SortField;
  order: SortOrder;
}
