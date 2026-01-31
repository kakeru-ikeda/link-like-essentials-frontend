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

export function detectConditionsInSentence(
  sentence: string
): TraitConditionType[] {
  const detected = new Set<TraitConditionType>();

  for (const [conditionType, patterns] of Object.entries(
    TRAIT_CONDITION_PATTERNS
  )) {
    if (conditionType === TraitConditionType.NONE) continue;

    for (const pattern of patterns as RegExp[]) {
      if (pattern.test(sentence)) {
        detected.add(conditionType as TraitConditionType);
        break;
      }
    }
  }

  return detected.size > 0
    ? Array.from(detected)
    : [TraitConditionType.NONE];
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

    const conditions = detectConditionsInSentence(sentence);
    const shouldIncludeDrawCondition =
      targetEffectType !== SkillEffectType.HEART_CAPTURE ||
      canAttributeDrawHeartCapture(sentence);

    conditions.forEach((condition) => {
      if (
        condition === TraitConditionType.DRAW &&
        !shouldIncludeDrawCondition
      ) {
        return;
      }

      results.push({
        condition,
        conditionLabel: TRAIT_CONDITION_LABELS[condition],
        conditionText: extractConditionText(sentence, condition),
        effectText: sentence,
        sentenceIndex: index,
      });
    });
  });

  return results;
}

export function getTraitConditionLabel(condition: TraitConditionType): string {
  return TRAIT_CONDITION_LABELS[condition];
}

export function extractHeartCollectValue(sentence: string): number | null {
  const match = sentence.match(/ハートを(\d+)個(回収|獲得)/);
  if (!match?.[1]) return null;
  const value = Number(match[1]);
  return Number.isNaN(value) ? null : value;
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

type MatchRange = { index: number; end: number };

function canAttributeDrawHeartCapture(sentence: string): boolean {
  const drawMatch = findFirstPatternMatch(
    sentence,
    TRAIT_CONDITION_PATTERNS[TraitConditionType.DRAW]
  );
  if (!drawMatch) return false;

  const effectMatch = findFirstKeywordMatch(
    sentence,
    getSkillEffectKeyword(SkillEffectType.HEART_CAPTURE),
    drawMatch.end
  );
  if (!effectMatch) return false;

  const heartCollectBetween = findFirstPatternMatch(
    sentence,
    TRAIT_CONDITION_PATTERNS[TraitConditionType.HEART_COLLECT],
    drawMatch.end,
    effectMatch.index
  );

  return !heartCollectBetween;
}

function findFirstPatternMatch(
  text: string,
  patterns: RegExp[],
  fromIndex = 0,
  toIndex?: number
): MatchRange | null {
  const boundedText = toIndex ? text.slice(0, toIndex) : text;
  let best: MatchRange | null = null;

  patterns.forEach((pattern) => {
    const regex = new RegExp(pattern.source, pattern.flags);
    const segment = boundedText.slice(fromIndex);
    const match = regex.exec(segment);
    if (!match) return;

    const index = match.index + fromIndex;
    const end = index + match[0].length;
    if (!best || index < best.index) {
      best = { index, end };
    }
  });

  return best;
}

function findFirstKeywordMatch(
  text: string,
  keywords: string[],
  fromIndex = 0
): MatchRange | null {
  let best: MatchRange | null = null;

  keywords.forEach((keyword) => {
    const result = findKeywordMatch(text, keyword, fromIndex);
    if (!result) return;

    if (!best || result.index < best.index) {
      best = result;
    }
  });

  return best;
}

function findKeywordMatch(
  text: string,
  keyword: string,
  fromIndex: number
): MatchRange | null {
  if (keyword.includes('\\')) {
    try {
      const regex = new RegExp(keyword);
      const segment = text.slice(fromIndex);
      const match = regex.exec(segment);
      if (!match) return null;
      const index = match.index + fromIndex;
      return { index, end: index + match[0].length };
    } catch {
      const index = text.indexOf(keyword, fromIndex);
      return index === -1
        ? null
        : { index, end: index + keyword.length };
    }
  }

  const index = text.indexOf(keyword, fromIndex);
  return index === -1 ? null : { index, end: index + keyword.length };
}
