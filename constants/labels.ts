import { Rarity, StyleType, LimitedType, FavoriteMode } from '@/models/enums';
import { SortField } from '@/models/Filter';

export const RARITY_LABELS: Record<Rarity, string> = {
  [Rarity.UR]: 'UR',
  [Rarity.SR]: 'SR',
  [Rarity.R]: 'R',
  [Rarity.DR]: 'DR',
  [Rarity.BR]: 'BR',
  [Rarity.LR]: 'LR',
};

export const STYLE_TYPE_LABELS: Record<StyleType, string> = {
  [StyleType.CHEERLEADER]: 'チアリーダー',
  [StyleType.TRICKSTER]: 'トリックスター',
  [StyleType.PERFORMER]: 'パフォーマー',
  [StyleType.MOODMAKER]: 'ムードメーカー',
};

export const LIMITED_TYPE_LABELS: Record<LimitedType, string> = {
  [LimitedType.PERMANENT]: '恒常',
  [LimitedType.LIMITED]: '限定',
  [LimitedType.BIRTHDAY_LIMITED]: '誕限定',
  [LimitedType.SPRING_LIMITED]: '春限定',
  [LimitedType.SUMMER_LIMITED]: '夏限定',
  [LimitedType.AUTUMN_LIMITED]: '秋限定',
  [LimitedType.WINTER_LIMITED]: '冬限定',
  [LimitedType.LEG_LIMITED]: 'LEG限定',
  [LimitedType.BATTLE_LIMITED]: '撃限定',
  [LimitedType.PARTY_LIMITED]: '宴限定',
  [LimitedType.ACTIVITY_LIMITED]: '活限定',
  [LimitedType.GRADUATE_LIMITED]: '卒限定',
  [LimitedType.LOGIN_BONUS]: 'ログボ',
  [LimitedType.REWARD]: '報酬',
};

export const FAVORITE_MODE_LABELS: Record<FavoriteMode, string> = {
  [FavoriteMode.NONE]: 'なし',
  [FavoriteMode.HAPPY]: 'ハッピー',
  [FavoriteMode.MELLOW]: 'メロウ',
  [FavoriteMode.NEUTRAL]: 'ニュートラル',
};
export const FAVORITE_MODE_COLORS: Record<FavoriteMode, string> = {
  [FavoriteMode.NONE]: '#9ca3af',
  [FavoriteMode.HAPPY]: '#f472b6',
  [FavoriteMode.MELLOW]: '#60a5fa',
  [FavoriteMode.NEUTRAL]: '#34d399',
};

export const SORT_FIELD_LABELS: Record<SortField, string> = {
  [SortField.CARD_NAME]: 'カード名',
  [SortField.CHARACTER_NAME]: 'キャラクター名',
  [SortField.RARITY]: 'レアリティ',
  [SortField.CREATED_AT]: '登録日',
  [SortField.UPDATED_AT]: '更新日',
  [SortField.SMILE]: 'スマイル',
  [SortField.PURE]: 'ピュア',
  [SortField.COOL]: 'クール',
  [SortField.MENTAL]: 'メンタル',
};

// スタイルタイプの色定義
export const STYLE_TYPE_COLORS: Record<StyleType, string> = {
  [StyleType.PERFORMER]: '#ef4444',
  [StyleType.MOODMAKER]: '#eab308',
  [StyleType.CHEERLEADER]: '#22c55e',
  [StyleType.TRICKSTER]: '#a855f7',
};

// 入手方法の色定義
export const LIMITED_TYPE_COLORS: Record<LimitedType, string> = {
  [LimitedType.PERMANENT]: '#6b7280',
  [LimitedType.LIMITED]: '#f59e0b',
  [LimitedType.BIRTHDAY_LIMITED]: '#ec4899',
  [LimitedType.SPRING_LIMITED]: '#4ade80',
  [LimitedType.SUMMER_LIMITED]: '#60a5fa',
  [LimitedType.AUTUMN_LIMITED]: '#f97316',
  [LimitedType.WINTER_LIMITED]: '#22d3ee',
  [LimitedType.LEG_LIMITED]: '#a855f7',
  [LimitedType.BATTLE_LIMITED]: '#dc2626',
  [LimitedType.PARTY_LIMITED]: '#f87171',
  [LimitedType.ACTIVITY_LIMITED]: '#14b8a6',
  [LimitedType.GRADUATE_LIMITED]: '#6366f1',
  [LimitedType.LOGIN_BONUS]: '#10b981',
  [LimitedType.REWARD]: '#ca8a04',
};
