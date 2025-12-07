import { Rarity, StyleType, LimitedType, FavoriteMode, SongCategory } from './enums';
import { SkillEffectType, SkillSearchTarget } from '@/constants/skillEffects';

/**
 * フィルター条件の結合モード
 */
export enum FilterMode {
  OR = 'OR',   // いずれかに一致（デフォルト）
  AND = 'AND', // すべてに一致
}

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

  // フィルター条件の結合モード（デフォルト: OR）
  filterMode?: FilterMode;

  // アクセサリーカードの有無
  hasAccessories?: boolean;
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

/**
 * 楽曲フィルター条件
 */
export interface SongFilter {
  // カテゴリー絞り込み
  category?: SongCategory;

  // 属性絞り込み
  attribute?: string;

  // センターキャラクター絞り込み
  centerCharacter?: string;

  // 楽曲名部分一致検索
  songName?: string;

  // 歌い手部分一致検索
  singersContains?: string;
}
