export interface EffectKeywordGroup {
  effectType: string;
  keywords: string[];
}

export interface SkillEffectKeywordsQueryData {
  skillEffectKeywords: EffectKeywordGroup[];
}

export interface TraitEffectKeywordsQueryData {
  traitEffectKeywords: EffectKeywordGroup[];
}
