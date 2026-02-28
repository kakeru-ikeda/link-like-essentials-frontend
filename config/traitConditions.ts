import { TraitConditionType, TraitEffectType } from '@/models/shared/enums';
import { TRAIT_EFFECT_KEYWORDS } from '@/config/traitEffects';

const toRegexPatterns = (keywords: string[]): RegExp[] =>
  keywords.map((keyword) => new RegExp(keyword));

const HEART_COLLECT_PATTERNS = toRegexPatterns(
  TRAIT_EFFECT_KEYWORDS[TraitEffectType.HEART_COLLECT]
);
const DRAW_PATTERNS = toRegexPatterns(
  TRAIT_EFFECT_KEYWORDS[TraitEffectType.DRAW]
);
const SHOT_PATTERNS = toRegexPatterns(
  TRAIT_EFFECT_KEYWORDS[TraitEffectType.SHOT]
);
const OVER_SECTION_PATTERNS = toRegexPatterns(
  TRAIT_EFFECT_KEYWORDS[TraitEffectType.OVER_SECTION]
);
const ACCUMULATE_PATTERNS = toRegexPatterns(
  TRAIT_EFFECT_KEYWORDS[TraitEffectType.ACCUMULATE]
);

export const TRAIT_CONDITION_PATTERNS: Record<TraitConditionType, RegExp[]> = {
  [TraitConditionType.NONE]: [],
  [TraitConditionType.DRAW]: [...DRAW_PATTERNS],
  [TraitConditionType.HEART_COLLECT]: [
    ...HEART_COLLECT_PATTERNS,
  ],
  [TraitConditionType.SHOT]: [...SHOT_PATTERNS],
  [TraitConditionType.OVER_SECTION]: [...OVER_SECTION_PATTERNS],
  [TraitConditionType.ACCUMULATE]: [...ACCUMULATE_PATTERNS],
};

export const TRAIT_CONDITION_LABELS: Record<TraitConditionType, string> = {
  [TraitConditionType.NONE]: 'その他',
  [TraitConditionType.DRAW]: 'ドロー時',
  [TraitConditionType.HEART_COLLECT]: 'ハートコレクト時',
  [TraitConditionType.SHOT]: 'ショット',
  [TraitConditionType.OVER_SECTION]: 'セクション跨ぎ',
  [TraitConditionType.ACCUMULATE]: '使用ごとに蓄積',
};
