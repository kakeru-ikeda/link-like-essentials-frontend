import { SkillEffectType, TraitConditionType } from '@/models/shared/enums';
import {
  TRAIT_CONDITION_LABELS,
  TRAIT_CONDITION_PATTERNS,
} from '@/config/traitConditions';
import { getSkillEffectKeyword } from '@/services/game/skillEffectService';

export interface DetectedTraitConditionEffect {
  condition: TraitConditionType;
  conditionLabel: string;
  conditionText: string;
  effectText: string;
  sentenceIndex: number;
}

export function splitTraitSentences(traitEffect: string): string[] {
  return traitEffect
    .split('。')
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence.length > 0);
}

export function detectConditionInSentence(
  sentence: string
): TraitConditionType {
  for (const [conditionType, patterns] of Object.entries(
    TRAIT_CONDITION_PATTERNS
  )) {
    if (conditionType === TraitConditionType.NONE) continue;

    for (const pattern of patterns as RegExp[]) {
      if (pattern.test(sentence)) {
        return conditionType as TraitConditionType;
      }
    }
  }
  return TraitConditionType.NONE;
}

export function hasEffectInSentence(
  sentence: string,
  effectType: SkillEffectType
): boolean {
  const keywords = getSkillEffectKeyword(effectType);
  return keywords.some((keyword) => matchesKeyword(sentence, keyword));
}

export function analyzeTraitForEffect(
  traitEffect: string,
  targetEffectType: SkillEffectType
): DetectedTraitConditionEffect[] {
  const results: DetectedTraitConditionEffect[] = [];
  const sentences = splitTraitSentences(traitEffect);

  sentences.forEach((sentence, index) => {
    if (!hasEffectInSentence(sentence, targetEffectType)) return;

    const condition = detectConditionInSentence(sentence);

    results.push({
      condition,
      conditionLabel: TRAIT_CONDITION_LABELS[condition],
      conditionText: extractConditionText(sentence, condition),
      effectText: sentence,
      sentenceIndex: index,
    });
  });

  return results;
}

export function getTraitConditionLabel(condition: TraitConditionType): string {
  return TRAIT_CONDITION_LABELS[condition];
}

function extractConditionText(
  sentence: string,
  condition: TraitConditionType
): string {
  const patterns = TRAIT_CONDITION_PATTERNS[condition];
  for (const pattern of patterns) {
    const match = sentence.match(pattern);
    if (match) {
      return match[0];
    }
  }
  return '';
}

function matchesKeyword(text: string, keyword: string): boolean {
  if (keyword.includes('\\')) {
    try {
      const regex = new RegExp(keyword);
      return regex.test(text);
    } catch {
      return text.includes(keyword);
    }
  }
  return text.includes(keyword);
}
