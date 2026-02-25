import { Rarity, StyleType, LimitedType, FavoriteMode } from '@/models/shared/enums';
import { SkillEffectType } from '@/models/shared/enums';

/**
 * キャラクターごとのテーマカラー定義
 */
export const CHARACTER_COLORS: Record<string, string> = {
  日野下花帆: '#f8b500',
  村野さやか: '#5383c3',
  乙宗梢: '#68be8d',
  夕霧綴理: '#ba2636',
  大沢瑠璃乃: '#e7609e',
  藤島慈: '#c8c2c6',
  徒町小鈴: '#fad764',
  百生吟子: '#a2d7dd',
  安養寺姫芽: '#9d8de2',
  桂城泉: '#1ebecd',
  セラス: '#f56455',
  大賀美沙知: '#aacc88',
} as const;

/**
 * レアリティの色定義
 */
export const RARITY_COLORS: Record<Rarity, string> = {
  [Rarity.UR]: '#f59e0b',
  [Rarity.SR]: '#8b5cf6',
  [Rarity.R]: '#3b82f6',
  [Rarity.DR]: '#ec4899',
  [Rarity.BR]: '#ef4444',
  [Rarity.LR]: '#06b6d4',
};

/**
 * スタイルタイプの色定義
 */
export const STYLE_TYPE_COLORS: Record<StyleType, string> = {
  [StyleType.PERFORMER]: '#ef4444',
  [StyleType.MOODMAKER]: '#eab308',
  [StyleType.CHEERLEADER]: '#22c55e',
  [StyleType.TRICKSTER]: '#a855f7',
};

/**
 * 入手方法の色定義
 */
export const LIMITED_TYPE_COLORS: Record<LimitedType, string> = {
  [LimitedType.PERMANENT]: '#6b7280',
  [LimitedType.LIMITED]: '#f59e0b',
  [LimitedType.BIRTHDAY_LIMITED]: '#ec4899',
  [LimitedType.SPRING_LIMITED]: '#4ade80',
  [LimitedType.SUMMER_LIMITED]: '#60a5fa',
  [LimitedType.AUTUMN_LIMITED]: '#f97316',
  [LimitedType.WINTER_LIMITED]: '#22d3ee',
  [LimitedType.LEG_LIMITED]: '#a855f7',
  [LimitedType.SHUFFLE_LIMITED]: '#ff00ff',
  [LimitedType.BATTLE_LIMITED]: '#dc2626',
  [LimitedType.PARTY_LIMITED]: '#f87171',
  [LimitedType.ACTIVITY_LIMITED]: '#14b8a6',
  [LimitedType.GRADUATE_LIMITED]: '#6366f1',
  [LimitedType.LOGIN_BONUS]: '#10b981',
  [LimitedType.REWARD]: '#ca8a04',
  [LimitedType.BANGDREAM_LIMITED]: '#f43f5e',
};

/**
 * 得意ムードの色定義
 */
export const FAVORITE_MODE_COLORS: Record<FavoriteMode, string> = {
  [FavoriteMode.NONE]: '#9ca3af',
  [FavoriteMode.HAPPY]: '#f472b6',
  [FavoriteMode.MELLOW]: '#60a5fa',
  [FavoriteMode.NEUTRAL]: '#34d399',
};

/**
 * フィルター UI 用カラー定義
 */
export const FILTER_COLOR_KEYWORD = '#3b82f6';
export const FILTER_COLOR_SKILL_EFFECT = '#10b981';
export const FILTER_COLOR_SKILL_SEARCH_TARGET = '#f97316';
export const FILTER_COLOR_TRAIT_EFFECT = '#9333ea';
export const FILTER_COLOR_TOKEN = '#06b6d4';

/**
 * スキル効果の色定義（デッキアナライザー用）
 */
export const SKILL_EFFECT_COLORS: Record<SkillEffectType, { border: string; bg: string; text: string }> = {
  [SkillEffectType.HEART_CAPTURE]: { border: '#ef4444', bg: '#ef4444', text: '#ffffff' },
  [SkillEffectType.HEART_BOOST]: { border: '#ef4444', bg: '#ef4444', text: '#ffffff' },
  [SkillEffectType.WIDE_HEART]: { border: '#dc2626', bg: '#dc2626', text: '#ffffff' },
  [SkillEffectType.WIDE_HEART_BOOST]: { border: '#dc2626', bg: '#dc2626', text: '#ffffff' },
  [SkillEffectType.LOVE_ATTRACT]: { border: '#f97316', bg: '#f97316', text: '#ffffff' },
  [SkillEffectType.ATTRACT_BOOST]: { border: '#f97316', bg: '#f97316', text: '#ffffff' },
  [SkillEffectType.VOLTAGE_GAIN]: { border: '#f59e0b', bg: '#f59e0b', text: '#ffffff' },
  [SkillEffectType.VOLTAGE_BOOST]: { border: '#f59e0b', bg: '#f59e0b', text: '#ffffff' },
  [SkillEffectType.MENTAL_RECOVER]: { border: '#22c55e', bg: '#22c55e', text: '#ffffff' },
  [SkillEffectType.MENTAL_PROTECT]: { border: '#22c55e', bg: '#22c55e', text: '#ffffff' },
  [SkillEffectType.EXTEND_HAND]: { border: '#a855f7', bg: '#a855f7', text: '#ffffff' },
  [SkillEffectType.RESHUFFLE]: { border: '#a855f7', bg: '#a855f7', text: '#ffffff' },
  [SkillEffectType.VIBES]: { border: '#6b7280', bg: '#6b7280', text: '#ffffff' },
  [SkillEffectType.AMBIENCE]: { border: '#6b7280', bg: '#6b7280', text: '#ffffff' },
  [SkillEffectType.MENTAL_GUARD]: { border: '#6b7280', bg: '#6b7280', text: '#ffffff' },
  [SkillEffectType.IMITATION]: { border: '#6b7280', bg: '#6b7280', text: '#ffffff' },
  [SkillEffectType.BLESSING]: { border: '#6b7280', bg: '#6b7280', text: '#ffffff' },
  [SkillEffectType.AP_GAIN]: { border: '#6b7280', bg: '#6b7280', text: '#ffffff' },
  [SkillEffectType.HEAT_UP]: { border: '#6b7280', bg: '#6b7280', text: '#ffffff' },
  [SkillEffectType.BELIEF]: { border: '#6b7280', bg: '#6b7280', text: '#ffffff' },
  [SkillEffectType.IGNITION]: { border: '#6b7280', bg: '#6b7280', text: '#ffffff' },
};

/**
 * イベントボタン用カラー定義
 */
export const EVENT_COLOR_LIVE_GRAND_PRIX = '#388afc';
export const EVENT_COLOR_GRADE_CHALLENGE = '#a952f4';

/**
 * デッキダッシュボードタブ用カラー定義
 */
export const DASHBOARD_TAB_COLORS = {
  blue:    '#3b82f6',
  amber:   '#f59e0b',
  emerald: '#10b981',
  purple:  '#a855f7',
} as const;

export type DashboardTabColor = keyof typeof DASHBOARD_TAB_COLORS;
