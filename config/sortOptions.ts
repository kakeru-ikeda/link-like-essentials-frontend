import { DropdownOption } from '@/components/common/Dropdown';
import { Rarity } from '@/models/shared/enums';

/**
 * カードソート項目
 */
export type CardSortBy = 'releaseDate' | 'rarity' | 'cardName';

/**
 * ソート順
 */
export type SortOrder = 'asc' | 'desc';

/**
 * 投稿デッキソート項目
 */
export type DeckSortBy = 'publishedAt' | 'viewCount' | 'likeCount';

/**
 * カードソート用オプション
 */
export const CARD_SORT_OPTIONS: DropdownOption<CardSortBy>[] = [
  { value: 'releaseDate', label: '実装日順' },
  { value: 'rarity', label: 'レアリティ順' },
  { value: 'cardName', label: 'カード名順' },
];

/**
 * デッキソート用オプション（投稿デッキ一覧）
 */
export const DECK_SORT_OPTIONS: DropdownOption<DeckSortBy>[] = [
  { value: 'publishedAt', label: '投稿日時順' },
  { value: 'viewCount', label: '閲覧数順' },
  { value: 'likeCount', label: 'いいね数順' },
];

/**
 * ソート順オプション（共通）
 */
export const ORDER_OPTIONS: DropdownOption<SortOrder>[] = [
  { value: 'desc', label: '降順' },
  { value: 'asc', label: '昇順' },
];

/**
 * レアリティの優先順位（降順用）
 * LR > UR > SR > R > BR > DR
 */
export const RARITY_ORDER: Record<Rarity, number> = {
  [Rarity.LR]: 6,
  [Rarity.UR]: 5,
  [Rarity.SR]: 4,
  [Rarity.R]: 3,
  [Rarity.BR]: 2,
  [Rarity.DR]: 1,
};
