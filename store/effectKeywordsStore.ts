import { create } from 'zustand';
import { SkillEffectType, TraitEffectType } from '@/models/shared/enums';

interface EffectKeywordsState {
  skillEffectKeywords: Record<string, string[]>;
  traitEffectKeywords: Record<string, string[]>;
  skillDescriptions: Record<string, string>;
  traitDescriptions: Record<string, string>;
  skillLabels: Record<string, string>;
  traitLabels: Record<string, string>;
  isLoaded: boolean;
  setSkillEffectKeywords: (keywords: Record<string, string[]>) => void;
  setTraitEffectKeywords: (keywords: Record<string, string[]>) => void;
  setSkillDescriptions: (descriptions: Record<string, string>) => void;
  setTraitDescriptions: (descriptions: Record<string, string>) => void;
  setSkillLabels: (labels: Record<string, string>) => void;
  setTraitLabels: (labels: Record<string, string>) => void;
  setLoaded: () => void;
  getSkillKeywords: (effectType: SkillEffectType) => string[];
  getTraitKeywords: (effectType: TraitEffectType) => string[];
  getSkillDescription: (effectType: SkillEffectType) => string;
  getTraitDescription: (effectType: TraitEffectType) => string;
  getSkillLabel: (effectType: SkillEffectType) => string;
  getTraitLabel: (effectType: TraitEffectType) => string;
}

export const useEffectKeywordsStore = create<EffectKeywordsState>((set, get) => ({
  skillEffectKeywords: {},
  traitEffectKeywords: {},
  skillDescriptions: {},
  traitDescriptions: {},
  skillLabels: {},
  traitLabels: {},
  isLoaded: false,

  setSkillEffectKeywords: (keywords) => set({ skillEffectKeywords: keywords }),

  setTraitEffectKeywords: (keywords) => set({ traitEffectKeywords: keywords }),

  setSkillDescriptions: (descriptions) => set({ skillDescriptions: descriptions }),

  setTraitDescriptions: (descriptions) => set({ traitDescriptions: descriptions }),

  setSkillLabels: (labels) => set({ skillLabels: labels }),

  setTraitLabels: (labels) => set({ traitLabels: labels }),

  setLoaded: () => set({ isLoaded: true }),

  getSkillKeywords: (effectType) => get().skillEffectKeywords[effectType] ?? [],

  getTraitKeywords: (effectType) => get().traitEffectKeywords[effectType] ?? [],

  getSkillDescription: (effectType) => get().skillDescriptions[effectType] ?? '',

  getTraitDescription: (effectType) => get().traitDescriptions[effectType] ?? '',

  getSkillLabel: (effectType) => get().skillLabels[effectType] ?? '',

  getTraitLabel: (effectType) => get().traitLabels[effectType] ?? '',
}));
