import { SkillEffectType } from '@/models/enums';

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
  [SkillEffectType.MENTAL_GUARD]:
    'メンタル最大値に対する一定割合のメンタル直接ダメージを無効化する。',
  [SkillEffectType.RESHUFFLE]:
    '手札を全て捨てた後、スキルを手札上限まで引く。',
  [SkillEffectType.EXTEND_HAND]:
    '手札の上限枚数を増加させる。',
  [SkillEffectType.IMITATION]:
    'スキル使用後にカードがステージ上にセットされ、何かを一定量吸収して別の何かに変換する。',
  [SkillEffectType.BLESSING]:
    '他のカードのスキルの消費APを減少させる。',
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
  [SkillEffectType.MENTAL_RECOVER]: ['メンタルを最大値の\\d+%回復'],
  [SkillEffectType.MENTAL_PROTECT]: ['メンタル自然減少を無効','メンタルダメージを無効'],
  [SkillEffectType.MENTAL_GUARD]: ['メンタル直接ダメージを無効'],
  [SkillEffectType.RESHUFFLE]: ['シャッフル', '手札をすべて捨てて', '手札を全て捨てて'],
  [SkillEffectType.EXTEND_HAND]: ['手札の上限枚数を', '手札の上限枚数を\\d+枚増加'],
  [SkillEffectType.BLESSING]: [
    'デッキ内の.+の消費AP-\\d+',
    'デッキ内の.+の消費APを-\\d+',
    '手札の(?!このスキル).*の消費AP-\\d+',
    '手札の(?!このスキル).*の消費APを-\\d+',
  ],
  [SkillEffectType.IMITATION]: ['カードがステージにセットされ'],
  [SkillEffectType.AP_GAIN]: ['APを\\d+回復'],
  [SkillEffectType.HEAT_UP]: ['AP回復速度を'],
  [SkillEffectType.BELIEF]: ['メンタルダウンしなくなり'],
  [SkillEffectType.IGNITION]: ['イグニッションモード'],
};
