import { TraitConditionType } from '@/models/shared/enums';
import type { TraitEffectType } from '@/models/shared/enums';
import { useEffectKeywordsStore } from '@/store/effectKeywordsStore';

const toRegexPatterns = (keywords: string[]): RegExp[] =>
  keywords.map((keyword) => new RegExp(keyword));

export function getTraitConditionPatterns(): Record<TraitConditionType, RegExp[]> {
  const getKeywords = (effectType: TraitEffectType) =>
    useEffectKeywordsStore.getState().getTraitKeywords(effectType);

  return {
    [TraitConditionType.NONE]: [],
    [TraitConditionType.DRAW]: toRegexPatterns(getKeywords('DRAW' as TraitEffectType)),
    [TraitConditionType.HEART_COLLECT]: toRegexPatterns(getKeywords('HEART_COLLECT' as TraitEffectType)),
    [TraitConditionType.SHOT]: toRegexPatterns(getKeywords('SHOT' as TraitEffectType)),
    [TraitConditionType.OVER_SECTION]: toRegexPatterns(getKeywords('OVER_SECTION' as TraitEffectType)),
    [TraitConditionType.ACCUMULATE]: toRegexPatterns(getKeywords('ACCUMULATE' as TraitEffectType)),
  };
}

export const TRAIT_CONDITION_LABELS: Record<TraitConditionType, string> = {
  [TraitConditionType.NONE]: 'その他',
  [TraitConditionType.DRAW]: 'ドロー時',
  [TraitConditionType.HEART_COLLECT]: 'ハートコレクト時',
  [TraitConditionType.SHOT]: 'ショット',
  [TraitConditionType.OVER_SECTION]: 'セクション跨ぎ',
  [TraitConditionType.ACCUMULATE]: '使用ごとに蓄積',
};
