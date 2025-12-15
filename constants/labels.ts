import { Rarity, StyleType, LimitedType, FavoriteMode, TokenFilter } from '@/models/enums';
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

export const TOKEN_FILTER_LABELS: Record<TokenFilter, string> = {
  [TokenFilter.HAS]: 'あり',
  [TokenFilter.NONE]: 'なし',
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
  [StyleType.PERFORMER]: 'bg-red-500 text-white',
  [StyleType.MOODMAKER]: 'bg-yellow-500 text-white',
  [StyleType.CHEERLEADER]: 'bg-green-500 text-white',
  [StyleType.TRICKSTER]: 'bg-purple-500 text-white',
};

// 入手方法の色定義
export const LIMITED_TYPE_COLORS: Record<LimitedType, string> = {
  [LimitedType.PERMANENT]: 'bg-gray-500 text-white',
  [LimitedType.LIMITED]: 'bg-amber-500 text-white',
  [LimitedType.BIRTHDAY_LIMITED]: 'bg-pink-500 text-white',
  [LimitedType.SPRING_LIMITED]: 'bg-green-400 text-white',
  [LimitedType.SUMMER_LIMITED]: 'bg-blue-400 text-white',
  [LimitedType.AUTUMN_LIMITED]: 'bg-orange-500 text-white',
  [LimitedType.WINTER_LIMITED]: 'bg-cyan-400 text-white',
  [LimitedType.LEG_LIMITED]: 'bg-purple-500 text-white',
  [LimitedType.BATTLE_LIMITED]: 'bg-red-600 text-white',
  [LimitedType.PARTY_LIMITED]: 'bg-red-400 text-white',
  [LimitedType.ACTIVITY_LIMITED]: 'bg-teal-500 text-white',
  [LimitedType.GRADUATE_LIMITED]: 'bg-indigo-500 text-white',
  [LimitedType.LOGIN_BONUS]: 'bg-emerald-500 text-white',
  [LimitedType.REWARD]: 'bg-yellow-600 text-white',
};
