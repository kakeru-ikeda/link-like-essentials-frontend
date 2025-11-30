/**
 * スキル効果の種類
 */
export enum SkillEffectType {
  HEART_CAPTURE = 'HEART_CAPTURE',
  WIDE_HEART = 'WIDE_HEART',
  LOVE_ATTRACT = 'LOVE_ATTRACT',
  VOLTAGE_GAIN = 'VOLTAGE_GAIN',
  HEART_BOOST = 'HEART_BOOST',
  WIDE_HEART_BOOST = 'WIDE_HEART_BOOST',
  ATTRACT_BOOST = 'ATTRACT_BOOST',
  VOLTAGE_BOOST = 'VOLTAGE_BOOST',
  VIBES = 'VIBES',
  AMBIENCE = 'AMBIENCE',
  MENTAL_RECOVER = 'MENTAL_RECOVER',
  MENTAL_PROTECT = 'MENTAL_PROTECT',
  RESHUFFLE = 'RESHUFFLE',
  EXTEND_HAND = 'EXTEND_HAND',
  BLESSING = 'BLESSING',
  IMITATION = 'IMITATION',
  AP_GAIN = 'AP_GAIN',
  HEAT_UP = 'HEAT_UP',
  BELIEF = 'BELIEF',
  IGNITION = 'IGNITION',
}

/**
 * スキル効果ラベル
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
  [SkillEffectType.RESHUFFLE]: 'リシャッフル',
  [SkillEffectType.EXTEND_HAND]: 'エクステンドハンド',
  [SkillEffectType.BLESSING]: 'ブレッシング',
  [SkillEffectType.IMITATION]: 'イミテーション',
  [SkillEffectType.AP_GAIN]: 'APゲイン',
  [SkillEffectType.HEAT_UP]: 'ヒートアップ',
  [SkillEffectType.BELIEF]: 'ビリーフ',
  [SkillEffectType.IGNITION]: 'イグニッション',
};

/**
 * スキル効果の説明
 */
export const SKILL_EFFECT_DESCRIPTIONS: Record<SkillEffectType, string> = {
  [SkillEffectType.HEART_CAPTURE]:
    'スキルハートを生成する。多くのものは、現在の1回あたりビートハート出現個数に比例して効果が増減する。',
  [SkillEffectType.WIDE_HEART]:
    '画面上に同時に存在できるハート数の上限を増加させる。',
  [SkillEffectType.LOVE_ATTRACT]:
    '獲得するLOVEを上昇する。効果期間は「ステージ中」「セクション中」「次のハート回収時」などのバリエーションがある。',
  [SkillEffectType.VOLTAGE_GAIN]:
    'ボルテージPt.を獲得する。',
  [SkillEffectType.HEART_BOOST]:
    'スキルハート獲得効果による獲得数を増加させる。',
  [SkillEffectType.WIDE_HEART_BOOST]:
    'ハート上限個数増加効果を増強する。',
  [SkillEffectType.ATTRACT_BOOST]:
    'ラブアトラクト効果を増強する。',
  [SkillEffectType.VOLTAGE_BOOST]:
    'ボルテージゲイン効果を増強する。',
  [SkillEffectType.VIBES]:
    'ビートハートの出現個数を増加させる。一部を除くハートキャプチャの効能も上がる。',
  [SkillEffectType.AMBIENCE]:
    'ハッピー、メロウいずれかの方向にムード値を増減する。',
  [SkillEffectType.MENTAL_RECOVER]:
    'メンタル最大値に対する一定割合のメンタルを回復する。',
  [SkillEffectType.MENTAL_PROTECT]:
    'メンタル最大値に対する一定割合のメンタル自然減少を無効化する。防げるのは自然減少のみで、スキルやセクション効果などによるメンタル減少は防げない。',
  [SkillEffectType.RESHUFFLE]:
    '手札を全て捨てた後、スキルを手札上限まで引く。',
  [SkillEffectType.EXTEND_HAND]:
    '手札の上限枚数を増加させる。',
  [SkillEffectType.BLESSING]:
    '他のカードのスキルの消費APを減少させる。',
  [SkillEffectType.IMITATION]:
    'スキル使用後にカードがステージ上にセットされ、何かを一定量吸収して別の何かに変換する。',
  [SkillEffectType.AP_GAIN]:
    'APを直接増加させる。ただし上限を超えることはない。',
  [SkillEffectType.HEAT_UP]:
    'AP回復速度を増加させる。',
  [SkillEffectType.BELIEF]:
    'メンタルが0以下になってもメンタルダウンしなくなる。',
  [SkillEffectType.IGNITION]:
    '姫芽を《イグニッションモード》にする。104期以降の楽曲でのみ効果がある。103期楽曲では何の効果も及ぼさない。',
};

/**
 * スキル効果の検索キーワードマッピング
 * 各効果に対応する検索文言を配列で定義
 */
export const SKILL_EFFECT_KEYWORDS: Record<SkillEffectType, string[]> = {
  [SkillEffectType.HEART_CAPTURE]: ['スキルハートを獲得'],
  [SkillEffectType.WIDE_HEART]: ['ハート上限を'],
  [SkillEffectType.LOVE_ATTRACT]: ['獲得するLOVEを'],
  [SkillEffectType.VOLTAGE_GAIN]: ['ボルテージPt.を'],
  [SkillEffectType.HEART_BOOST]: ['スキルハート獲得効果による獲得数を'],
  [SkillEffectType.WIDE_HEART_BOOST]: ['ハート上限個数増加効果を', 'ハート上限増加効果を'],
  [SkillEffectType.ATTRACT_BOOST]: ['ラブアトラクト効果を'],
  [SkillEffectType.VOLTAGE_BOOST]: ['ボルテージゲイン効果を'],
  [SkillEffectType.VIBES]: ['ビートハートの出現個数を'],
  [SkillEffectType.AMBIENCE]: ['ムード値を'],
  [SkillEffectType.MENTAL_RECOVER]: ['メンタルを最大値の'],
  [SkillEffectType.MENTAL_PROTECT]: ['メンタル自然減少を無効'],
  [SkillEffectType.RESHUFFLE]: ['シャッフル', '手札をすべて捨てて', '手札を全て捨てて'],
  [SkillEffectType.EXTEND_HAND]: ['手札の上限枚数を'],
  [SkillEffectType.BLESSING]: ['消費APを-'],
  [SkillEffectType.IMITATION]: ['カードがステージにセットされ'],
  [SkillEffectType.AP_GAIN]: ['APを\\d+回復'],
  [SkillEffectType.HEAT_UP]: ['AP回復速度を'],
  [SkillEffectType.BELIEF]: ['メンタルダウンしなくなり'],
  [SkillEffectType.IGNITION]: ['イグニッションモード'],
};

/**
 * スキル検索対象の種類
 */
export enum SkillSearchTarget {
  SPECIAL_APPEAL = 'SPECIAL_APPEAL',
  SKILL = 'SKILL',
  TRAIT = 'TRAIT',
}

/**
 * スキル検索対象ラベル
 */
export const SKILL_SEARCH_TARGET_LABELS: Record<SkillSearchTarget, string> = {
  [SkillSearchTarget.SPECIAL_APPEAL]: 'スペシャルアピール',
  [SkillSearchTarget.SKILL]: 'スキル',
  [SkillSearchTarget.TRAIT]: '特性',
};

/**
 * スキル効果の検索キーワードを取得
 * @param effectType スキル効果の種類
 * @returns 検索キーワードの配列
 */
export function getSkillEffectKeyword(effectType: SkillEffectType): string[] {
  return SKILL_EFFECT_KEYWORDS[effectType];
}

/**
 * 複数のスキル効果から検索キーワードを生成
 * @param effectTypes スキル効果の種類の配列
 * @returns 検索キーワードの配列（フラット化）
 */
export function getSkillEffectKeywords(effectTypes: SkillEffectType[]): string[] {
  return effectTypes.flatMap((type) => SKILL_EFFECT_KEYWORDS[type]);
}
