import type { Card } from '@/models/card/Card';
import type { Deck } from '@/models/deck/Deck';
import type {
  DeckAnalysis,
  DetectedSkillEffect,
  DetectedTraitEffect,
  RequiredEffectAnalysis,
} from '@/models/deck/DeckAnalysis';
import { SkillEffectType, TraitConditionType } from '@/models/shared/enums';
import { getSkillEffectKeyword } from '@/services/game/skillEffectService';
import {
  analyzeTraitForEffect,
  getTraitConditionLabel,
} from '@/services/game/traitConditionService';

const REQUIRED_EFFECTS: { effectType: SkillEffectType; label: string }[] = [
  { effectType: SkillEffectType.HEART_CAPTURE, label: 'ハートキャプチャ' },
  { effectType: SkillEffectType.WIDE_HEART, label: 'ワイドハート' },
  { effectType: SkillEffectType.LOVE_ATTRACT, label: 'ラブアトラクト' },
  { effectType: SkillEffectType.VOLTAGE_GAIN, label: 'ボルテージゲイン' },
  { effectType: SkillEffectType.HEART_BOOST, label: 'ハートブースト' },
  { effectType: SkillEffectType.WIDE_HEART_BOOST, label: 'ワイドブースト' },
  { effectType: SkillEffectType.ATTRACT_BOOST, label: 'アトラクトブースト' },
  { effectType: SkillEffectType.VOLTAGE_BOOST, label: 'ボルテージブースト' },
  { effectType: SkillEffectType.MENTAL_RECOVER, label: 'メンタルリカバー' },
  { effectType: SkillEffectType.MENTAL_PROTECT, label: 'メンタルプロテクト' },
  { effectType: SkillEffectType.EXTEND_HAND, label: 'エクステンドハンド' },
  { effectType: SkillEffectType.RESHUFFLE, label: 'リシャッフル' },
];

export function analyzeDeck(deck: Deck | null): DeckAnalysis | null {
  if (!deck) return null;

  const cards = deck.slots
    .filter((slot) => slot.card)
    .map((slot) => slot.card as Card);

  return {
    totalSlots: deck.slots.length,
    assignedSlots: cards.length,
    requiredEffects: REQUIRED_EFFECTS.map((req) =>
      analyzeRequiredEffect(cards, req.effectType, req.label)
    ),
  };
}

function analyzeRequiredEffect(
  cards: Card[],
  effectType: SkillEffectType,
  label: string
): RequiredEffectAnalysis {
  const skillMatches: DetectedSkillEffect[] = [];
  const traitMatchesMap = new Map<TraitConditionType, DetectedTraitEffect[]>();
  const uniqueCardIds = new Set<string>();
  const matchedSkillKeys = new Set<string>();

  const keywords = getSkillEffectKeyword(effectType);

  cards.forEach((card) => {
    if (card.detail?.skill?.effect) {
      if (matchesKeywords(card.detail.skill.effect, keywords)) {
        const effectText = findMatchedSentence(
          card.detail.skill.effect,
          keywords
        );
        const key = `${card.id}-skill-main`;
        if (!matchedSkillKeys.has(key)) {
          skillMatches.push({
            card,
            source: 'skill',
            isAccessory: false,
            effectText,
          });
          matchedSkillKeys.add(key);
        }
        uniqueCardIds.add(card.id);
      }
    }

    card.accessories?.forEach((acc, index) => {
      if (acc.effect && matchesKeywords(acc.effect, keywords)) {
        const effectText = findMatchedSentence(acc.effect, keywords);
        const key = `${card.id}-skill-acc-${index}`;
        if (!matchedSkillKeys.has(key)) {
          skillMatches.push({
            card,
            source: 'skill',
            isAccessory: true,
            accessoryIndex: index,
            effectText,
          });
          matchedSkillKeys.add(key);
        }
        uniqueCardIds.add(card.id);
      }
    });

    if (card.detail?.trait?.effect) {
      const traitResults = analyzeTraitForEffect(
        card.detail.trait.effect,
        effectType
      );
      traitResults.forEach((result) => {
        const traitMatch: DetectedTraitEffect = {
          card,
          source: 'trait',
          isAccessory: false,
          condition: result.condition,
          conditionText: result.conditionText,
          effectText: result.effectText,
          sentenceIndex: result.sentenceIndex,
        };

        if (!traitMatchesMap.has(result.condition)) {
          traitMatchesMap.set(result.condition, []);
        }
        traitMatchesMap.get(result.condition)!.push(traitMatch);
        uniqueCardIds.add(card.id);
      });
    }

    card.accessories?.forEach((acc, index) => {
      if (!acc.traitEffect) return;

      const traitResults = analyzeTraitForEffect(acc.traitEffect, effectType);
      traitResults.forEach((result) => {
        const traitMatch: DetectedTraitEffect = {
          card,
          source: 'trait',
          isAccessory: true,
          accessoryIndex: index,
          condition: result.condition,
          conditionText: result.conditionText,
          effectText: result.effectText,
          sentenceIndex: result.sentenceIndex,
        };

        if (!traitMatchesMap.has(result.condition)) {
          traitMatchesMap.set(result.condition, []);
        }
        traitMatchesMap.get(result.condition)!.push(traitMatch);
        uniqueCardIds.add(card.id);
      });
    });
  });

  const traitMatches = Array.from(traitMatchesMap.entries()).map(
    ([condition, items]) => ({
      condition,
      conditionLabel: getTraitConditionLabel(condition),
      items,
    })
  );

  const traitTriggerOrder = ['ドロー時', 'ハートコレクト時', '常時'];
  traitMatches.sort((a, b) => {
    const aIndex = traitTriggerOrder.indexOf(a.conditionLabel);
    const bIndex = traitTriggerOrder.indexOf(b.conditionLabel);
    const normalizedA = aIndex === -1 ? Number.MAX_SAFE_INTEGER : aIndex;
    const normalizedB = bIndex === -1 ? Number.MAX_SAFE_INTEGER : bIndex;
    return normalizedA - normalizedB;
  });

  return {
    effectType,
    label,
    keywords,
    skillMatches,
    traitMatches,
    totalUniqueCards: uniqueCardIds.size,
  };
}

function matchesKeywords(text: string, keywords: string[]): boolean {
  return keywords.some((keyword) => {
    if (keyword.includes('\\')) {
      try {
        const regex = new RegExp(keyword);
        return regex.test(text);
      } catch {
        return text.includes(keyword);
      }
    }
    return text.includes(keyword);
  });
}

function findMatchedSentence(
  text: string,
  keywords: string[]
): string | undefined {
  const sentences = text
    .split('。')
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence.length > 0);

  return (
    sentences.find((sentence) => matchesKeywords(sentence, keywords)) ??
    sentences[0]
  );
}

