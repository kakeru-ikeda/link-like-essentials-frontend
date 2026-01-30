import type { Card } from '@/models/card/Card';
import type { SkillEffectType, TraitConditionType } from '@/models/shared/enums';

export type DetectedEffectSource = 'skill' | 'trait';

export interface DetectedSkillEffect {
  card: Card;
  source: DetectedEffectSource;
  isAccessory: boolean;
  accessoryIndex?: number;
  effectText?: string;
}

export interface DetectedTraitEffect extends DetectedSkillEffect {
  source: 'trait';
  condition: TraitConditionType;
  conditionText: string;
  effectText: string;
  sentenceIndex: number;
}

export interface RequiredEffectAnalysis {
  effectType: SkillEffectType;
  label: string;
  keywords: string[];
  skillMatches: DetectedSkillEffect[];
  traitMatches: {
    condition: TraitConditionType;
    conditionLabel: string;
    items: DetectedTraitEffect[];
  }[];
  totalUniqueCards: number;
}

export interface DeckAnalysis {
  totalSlots: number;
  assignedSlots: number;
  requiredEffects: RequiredEffectAnalysis[];
}
