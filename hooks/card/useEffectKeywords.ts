import { useEffect } from 'react';
import { useQuery } from '@apollo/client';
import type { SkillEffectType, TraitEffectType } from '@/models/shared/enums';
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
    setSkillLabels,
    setTraitLabels,
    setSkillEffectTypes,
    setTraitEffectTypes,
    setLoaded,
  } = useEffectKeywordsStore();

  const { data: skillData, error: skillError } = useQuery<SkillEffectKeywordsQueryData>(
    GET_SKILL_EFFECT_KEYWORDS,
    { fetchPolicy: 'cache-first' }
  );

  const { data: traitData, error: traitError } = useQuery<TraitEffectKeywordsQueryData>(
    GET_TRAIT_EFFECT_KEYWORDS,
    { fetchPolicy: 'cache-first' }
  );

  useEffect(() => {
    if (skillError || traitError) {
      console.error('エフェクトキーワードの取得に失敗しました:', skillError ?? traitError);
      setLoaded();
    }
  }, [skillError, traitError, setLoaded]);

  useEffect(() => {
    if (!skillData || !traitData) return;

    const skillMap: Record<string, string[]> = {};
    const skillDescMap: Record<string, string> = {};
    const skillLabelMap: Record<string, string> = {};
    const skillTypes: SkillEffectType[] = [];
    for (const group of skillData.skillEffectKeywords) {
      const t = group.effectType as SkillEffectType;
      skillMap[t] = group.keywords;
      skillDescMap[t] = group.description;
      skillLabelMap[t] = group.label;
      skillTypes.push(t);
    }

    const traitMap: Record<string, string[]> = {};
    const traitDescMap: Record<string, string> = {};
    const traitLabelMap: Record<string, string> = {};
    const traitTypes: TraitEffectType[] = [];
    for (const group of traitData.traitEffectKeywords) {
      const t = group.effectType as TraitEffectType;
      traitMap[t] = group.keywords;
      traitDescMap[t] = group.description;
      traitLabelMap[t] = group.label;
      traitTypes.push(t);
    }

    setSkillEffectKeywords(skillMap);
    setTraitEffectKeywords(traitMap);
    setSkillDescriptions(skillDescMap);
    setTraitDescriptions(traitDescMap);
    setSkillLabels(skillLabelMap);
    setTraitLabels(traitLabelMap);
    setSkillEffectTypes(skillTypes);
    setTraitEffectTypes(traitTypes);
    setLoaded();
  }, [
    skillData,
    traitData,
    setSkillEffectKeywords,
    setTraitEffectKeywords,
    setSkillDescriptions,
    setTraitDescriptions,
    setSkillLabels,
    setTraitLabels,
    setSkillEffectTypes,
    setTraitEffectTypes,
    setLoaded,
  ]);
}
