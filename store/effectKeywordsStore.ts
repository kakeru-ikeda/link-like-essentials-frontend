import { create } from 'zustand';
import { SkillEffectType, TraitEffectType } from '@/models/shared/enums';

interface EffectKeywordsState {
  skillEffectKeywords: Record<string, string[]>;
  traitEffectKeywords: Record<string, string[]>;
  isLoaded: boolean;
  setSkillEffectKeywords: (keywords: Record<string, string[]>) => void;
  setTraitEffectKeywords: (keywords: Record<string, string[]>) => void;
  setLoaded: () => void;
  getSkillKeywords: (effectType: SkillEffectType) => string[];
  getTraitKeywords: (effectType: TraitEffectType) => string[];
}

export const useEffectKeywordsStore = create<EffectKeywordsState>((set, get) => ({
  skillEffectKeywords: {},
  traitEffectKeywords: {},
  isLoaded: false,

  setSkillEffectKeywords: (keywords) => set({ skillEffectKeywords: keywords }),

  setTraitEffectKeywords: (keywords) => set({ traitEffectKeywords: keywords }),

  setLoaded: () => set({ isLoaded: true }),

  getSkillKeywords: (effectType) => get().skillEffectKeywords[effectType] ?? [],

  getTraitKeywords: (effectType) => get().traitEffectKeywords[effectType] ?? [],
}));
