import type { Card, Token } from '@/models/card/Card';
import type { SkillEffectType, TraitConditionType } from '@/models/shared/enums';

export type DetectedEffectSource = 'skill' | 'trait';

export interface DetectedSkillEffect {
  card: Card;
  source: DetectedEffectSource;
  isToken: boolean;
  tokenIndex?: number;
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

export interface UnDrawCardInfo {
  card: Card;
  isToken: boolean;
  tokenIndex?: number;
  sections: {
    section1: boolean;
    section2: boolean;
    section3: boolean;
    section4: boolean;
    section5: boolean;
    sectionFever: boolean;
  } | null;
  conditionDetail: {
    reasoning?: string;
    originalText?: string;
    sectionConditions?: Array<{
      section: string;
      available: boolean;
      reason?: string;
    }>;
    additionalConditions?: string[];
  } | null;
}

export type ExcludedReason = 'UN_DRAW' | 'IMITATION' | 'INSTANCE';

export interface ExcludedCardInfo {
  card: Card;
  reasons: ExcludedReason[];
}

export interface TokenCardInfo {
  card: Card;
  token: Token;
  tokenIndex: number;
}

export interface DeckAnalysis {
  totalSlots: number;
  assignedSlots: number;
  unDrawCount: number;
  imitationCount: number;
  instanceCount: number;
  drawCount: number;
  drawCountBySection: {
    section1: number;
    section2: number;
    section3: number;
    section4: number;
    section5: number;
    sectionFever: number;
  };
  requiredEffects: RequiredEffectAnalysis[];
  unDrawCards: UnDrawCardInfo[];
  excludedCards: ExcludedCardInfo[];
  tokenCards: TokenCardInfo[];
}
