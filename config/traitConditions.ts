import { TraitConditionType, TraitEffectType } from '@/models/shared/enums';
import { useEffectKeywordsStore } from '@/store/effectKeywordsStore';

const toRegexPatterns = (keywords: string[]): RegExp[] =>
  keywords.map((keyword) => new RegExp(keyword));

export function getTraitConditionPatterns(): Record<TraitConditionType, RegExp[]> {
  const getKeywords = (effectType: TraitEffectType) =>
    useEffectKeywordsStore.getState().getTraitKeywords(effectType);

  return {
    [TraitConditionType.NONE]: [],
    [TraitConditionType.DRAW]: toRegexPatterns(getKeywords(TraitEffectType.DRAW)),
    [TraitConditionType.HEART_COLLECT]: toRegexPatterns(getKeywords(TraitEffectType.HEART_COLLECT)),
    [TraitConditionType.SHOT]: toRegexPatterns(getKeywords(TraitEffectType.SHOT)),
    [TraitConditionType.OVER_SECTION]: toRegexPatterns(getKeywords(TraitEffectType.OVER_SECTION)),
    [TraitConditionType.ACCUMULATE]: toRegexPatterns(getKeywords(TraitEffectType.ACCUMULATE)),
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
