import { useEffect } from 'react';
import { useQuery } from '@apollo/client';
import {
  GET_SKILL_EFFECT_KEYWORDS,
  GET_TRAIT_EFFECT_KEYWORDS,
} from '@/repositories/graphql/queries/effectKeywords';
import type {
  SkillEffectKeywordsQueryData,
  TraitEffectKeywordsQueryData,
} from '@/types/graphql/effectKeywords';
import { useEffectKeywordsStore } from '@/store/effectKeywordsStore';

/**
 * アプリ起動時にスキル効果・特性効果のキーワードをDBから取得してStoreに保存する
 * Apollo Client の cache-first により初回以降はキャッシュから返る
 */
export function useEffectKeywordsLoader() {
  const {
    setSkillEffectKeywords,
    setTraitEffectKeywords,
    setSkillDescriptions,
    setTraitDescriptions,
    setLoaded,
  } = useEffectKeywordsStore();

  const { data: skillData } = useQuery<SkillEffectKeywordsQueryData>(
    GET_SKILL_EFFECT_KEYWORDS,
    { fetchPolicy: 'cache-first' }
  );

  const { data: traitData } = useQuery<TraitEffectKeywordsQueryData>(
    GET_TRAIT_EFFECT_KEYWORDS,
    { fetchPolicy: 'cache-first' }
  );

  useEffect(() => {
    if (!skillData || !traitData) return;

    const skillMap: Record<string, string[]> = {};
    const skillDescMap: Record<string, string> = {};
    for (const group of skillData.skillEffectKeywords) {
      skillMap[group.effectType] = group.keywords;
      skillDescMap[group.effectType] = group.description;
    }

    const traitMap: Record<string, string[]> = {};
    const traitDescMap: Record<string, string> = {};
    for (const group of traitData.traitEffectKeywords) {
      traitMap[group.effectType] = group.keywords;
      traitDescMap[group.effectType] = group.description;
    }

    setSkillEffectKeywords(skillMap);
    setTraitEffectKeywords(traitMap);
    setSkillDescriptions(skillDescMap);
    setTraitDescriptions(traitDescMap);
    setLoaded();
  }, [
    skillData,
    traitData,
    setSkillEffectKeywords,
    setTraitEffectKeywords,
    setSkillDescriptions,
    setTraitDescriptions,
    setLoaded,
  ]);
}
