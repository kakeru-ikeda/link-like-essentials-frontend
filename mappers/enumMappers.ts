import {
  Rarity,
  StyleType,
  FavoriteMode,
  LimitedType,
  DeckType,
  SkillSearchTarget,
} from '@/models/shared/enums';
import { SortField } from '@/models/shared/Filter';

/**
 * レアリティのラベル定義
 */
export const RARITY_LABELS: Record<Rarity, string> = {
  [Rarity.UR]: 'UR',
  [Rarity.SR]: 'SR',
  [Rarity.R]: 'R',
  [Rarity.DR]: 'DR',
  [Rarity.BR]: 'BR',
  [Rarity.LR]: 'LR',
};

/**
 * スタイルタイプのラベル定義
 */
export const STYLE_TYPE_LABELS: Record<StyleType, string> = {
  [StyleType.CHEERLEADER]: 'チアリーダー',
  [StyleType.TRICKSTER]: 'トリックスター',
  [StyleType.PERFORMER]: 'パフォーマー',
  [StyleType.MOODMAKER]: 'ムードメーカー',
};

/**
 * 得意ムードのラベル定義
 */
export const FAVORITE_MODE_LABELS: Record<FavoriteMode, string> = {
  [FavoriteMode.NONE]: 'なし',
  [FavoriteMode.HAPPY]: 'ハッピー',
  [FavoriteMode.MELLOW]: 'メロウ',
  [FavoriteMode.NEUTRAL]: 'ニュートラル',
};

/**
 * 入手方法のラベル定義
 */
export const LIMITED_TYPE_LABELS: Record<LimitedType, string> = {
  [LimitedType.PERMANENT]: '恒常',
  [LimitedType.LIMITED]: '限定',
  [LimitedType.BIRTHDAY_LIMITED]: '誕限定',
  [LimitedType.SPRING_LIMITED]: '春限定',
  [LimitedType.SUMMER_LIMITED]: '夏限定',
  [LimitedType.AUTUMN_LIMITED]: '秋限定',
  [LimitedType.WINTER_LIMITED]: '冬限定',
  [LimitedType.LEG_LIMITED]: 'LEG限定',
  [LimitedType.SHUFFLE_LIMITED]: '混限定',
  [LimitedType.BATTLE_LIMITED]: '撃限定',
  [LimitedType.BANGDREAM_LIMITED]: 'バンドリ限定',
  [LimitedType.PARTY_LIMITED]: '宴限定',
  [LimitedType.ACTIVITY_LIMITED]: '活限定',
  [LimitedType.GRADUATE_LIMITED]: '卒限定',
  [LimitedType.LOGIN_BONUS]: 'ログボ',
  [LimitedType.REWARD]: '報酬',
};

/**
 * ソートフィールドのラベル定義
 */
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

/**
 * スキル検索対象のラベル定義
 */
export const SKILL_SEARCH_TARGET_LABELS: Record<SkillSearchTarget, string> = {
  [SkillSearchTarget.SPECIAL_APPEAL]: 'スペシャルアピール',
  [SkillSearchTarget.SKILL]: 'スキル',
  [SkillSearchTarget.TRAIT]: '特性',
};
