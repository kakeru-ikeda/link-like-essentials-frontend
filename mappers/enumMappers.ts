import {
  Rarity,
  StyleType,
  FavoriteMode,
  LimitedType,
  DeckType,
  SkillEffectType,
  SkillSearchTarget,
  TraitEffectType,
} from '@/models/enums';
import { SortField } from '@/models/Filter';

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
  [LimitedType.BATTLE_LIMITED]: '撃限定',
  [LimitedType.BANGDREAM_LIMITED]: 'バンドリ限定',
  [LimitedType.PARTY_LIMITED]: '宴限定',
  [LimitedType.ACTIVITY_LIMITED]: '活限定',
  [LimitedType.GRADUATE_LIMITED]: '卒限定',
  [LimitedType.LOGIN_BONUS]: 'ログボ',
  [LimitedType.REWARD]: '報酬',
};

/**
 * デッキタイプのラベル定義
 */
export const DECK_TYPE_LABELS: Record<DeckType, string> = {
  [DeckType.TERM_103]: '103期',
  [DeckType.TERM_104]: '104期',
  [DeckType.TERM_105]: '105期',
  [DeckType.TERM_105_FT_KOZUE]: '105期ft.梢',
  [DeckType.TERM_105_FT_TSUZURI]: '105期ft.綴理',
  [DeckType.TERM_105_FT_MEGUMI]: '105期ft.慈',
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
 * スキル効果のラベル定義
 */
export const SKILL_EFFECT_LABELS: Record<SkillEffectType, string> = {
  [SkillEffectType.HEART_CAPTURE]: 'ハートキャプチャ',
  [SkillEffectType.WIDE_HEART]: 'ワイドハート',
  [SkillEffectType.LOVE_ATTRACT]: 'ラブアトラクト',
  [SkillEffectType.VOLTAGE_GAIN]: 'ボルテージゲイン',
  [SkillEffectType.HEART_BOOST]: 'ハートブースト',
  [SkillEffectType.WIDE_HEART_BOOST]: 'ワイドハートブースト',
  [SkillEffectType.ATTRACT_BOOST]: 'アトラクトブースト',
  [SkillEffectType.VOLTAGE_BOOST]: 'ボルテージブースト',
  [SkillEffectType.VIBES]: 'バイブス',
  [SkillEffectType.AMBIENCE]: 'アンビエンス',
  [SkillEffectType.MENTAL_RECOVER]: 'メンタルリカバー',
  [SkillEffectType.MENTAL_PROTECT]: 'メンタルプロテクト',
  [SkillEffectType.MENTAL_GUARD]: 'メンタルガード',
  [SkillEffectType.RESHUFFLE]: 'リシャッフル',
  [SkillEffectType.EXTEND_HAND]: 'エクステンドハンド',
  [SkillEffectType.IMITATION]: 'イミテーション',
  [SkillEffectType.BLESSING]: 'ブレッシング',
  [SkillEffectType.AP_GAIN]: 'APゲイン',
  [SkillEffectType.HEAT_UP]: 'ヒートアップ',
  [SkillEffectType.BELIEF]: 'ビリーフ',
  [SkillEffectType.IGNITION]: 'イグニッション',
};

/**
 * スキル検索対象のラベル定義
 */
export const SKILL_SEARCH_TARGET_LABELS: Record<SkillSearchTarget, string> = {
  [SkillSearchTarget.SPECIAL_APPEAL]: 'スペシャルアピール',
  [SkillSearchTarget.SKILL]: 'スキル',
  [SkillSearchTarget.TRAIT]: '特性',
};

/**
 * 特性効果のラベル定義
 */
export const TRAIT_EFFECT_LABELS: Record<TraitEffectType, string> = {
  [TraitEffectType.ENCORE]: 'アンコール',
  [TraitEffectType.SHOT]: 'ショット',
  [TraitEffectType.AP_REDUCE]: 'APレデュース',
  [TraitEffectType.AP_SUPPORT]: 'APサポート',
  [TraitEffectType.INTERPRETATION]: 'インタープリテーション',
  [TraitEffectType.ACCUMULATE]: 'アキューミュレイト',
  [TraitEffectType.OVER_SECTION]: 'オーバーセクション',
  [TraitEffectType.ALTERNATE_IGNITION]: 'オルタネイト：イグニッション',
  [TraitEffectType.SEARCH]: 'サーチ',
  [TraitEffectType.CHAIN]: 'チェイン',
  [TraitEffectType.DRAW]: 'ドロー',
  [TraitEffectType.FAVORITE]: 'フェイバリット',
  [TraitEffectType.REINFORCE]: 'リインフォース',
  [TraitEffectType.INSTANCE]: 'インスタンス',
  [TraitEffectType.IMMORTAL]: 'インモータル',
  [TraitEffectType.HEART_COLLECT]: 'ハートコレクト',
  [TraitEffectType.UN_DRAW]: 'アンドロー(仮)',
};
