import { StyleType, FavoriteMode, LimitedType, DeckType } from '@/models/enums';

/**
 * スタイルタイプのEnum → 日本語マッピング
 */
export const STYLE_TYPE_MAP: Record<StyleType, string> = {
  [StyleType.CHEERLEADER]: 'チアリーダー',
  [StyleType.MOODMAKER]: 'ムードメーカー',
  [StyleType.PERFORMER]: 'パフォーマー',
  [StyleType.TRICKSTER]: 'トリックスター',
};

/**
 * デッキタイプのEnum → 日本語マッピング
 */
export const DECK_TYPE_MAP: Record<DeckType, string> = {
  [DeckType.TERM_103]: '103期',
  [DeckType.TERM_104]: '104期',
  [DeckType.TERM_105]: '105期',
  [DeckType.TERM_105_FT_KOZUE]: '105期ft.梢',
  [DeckType.TERM_105_FT_TSUZURI]: '105期ft.綴理',
  [DeckType.TERM_105_FT_MEGUMI]: '105期ft.慈',
};

/**
 * 得意ムードのEnum → 日本語マッピング
 */
export const FAVORITE_MODE_MAP: Record<FavoriteMode, string> = {
  [FavoriteMode.HAPPY]: 'ハッピー',
  [FavoriteMode.MELLOW]: 'メロウ',
  [FavoriteMode.NEUTRAL]: 'ニュートラル',
  [FavoriteMode.NONE]: '--',
};

/**
 * 入手方法のEnum → 日本語マッピング
 */
export const LIMITED_TYPE_MAP: Record<LimitedType, string> = {
  [LimitedType.PERMANENT]: '恒常',
  [LimitedType.REWARD]: '報酬',
  [LimitedType.SUMMER_LIMITED]: '夏限定',
  [LimitedType.AUTUMN_LIMITED]: '秋限定',
  [LimitedType.WINTER_LIMITED]: '冬限定',
  [LimitedType.SPRING_LIMITED]: '春限定',
  [LimitedType.LIMITED]: '限定',
  [LimitedType.PARTY_LIMITED]: '宴限定',
  [LimitedType.BIRTHDAY_LIMITED]: '誕生日限定',
  [LimitedType.GRADUATE_LIMITED]: '卒限定',
  [LimitedType.LEG_LIMITED]: 'LEG限定',
  [LimitedType.LOGIN_BONUS]: 'ログボ',
  [LimitedType.BATTLE_LIMITED]: '撃限定',
  [LimitedType.ACTIVITY_LIMITED]: '活限定',
};
