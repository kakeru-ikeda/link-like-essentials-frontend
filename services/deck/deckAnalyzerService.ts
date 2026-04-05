import type { Card } from '@/models/card/Card';
import type { Deck } from '@/models/deck/Deck';
import type {
  TokenCardInfo,
  DeckAnalysis,
  DetectedSkillEffect,
  DetectedTraitEffect,
  ExcludedCardInfo,
  ExcludedReason,
  RequiredEffectAnalysis,
  UnDrawCardInfo,
} from '@/models/deck/DeckAnalysis';
import type { CardTraitAnalysisData } from '@/models/card/TraitAnalysis';
import type { SkillEffectType, TraitEffectType } from '@/models/shared/enums';
import { TraitConditionType, asSkillEffectType } from '@/models/shared/enums';
import { getSkillEffectKeyword, hasSkillEffect } from '@/services/game/skillEffectService';
import { matchesKeywords } from '@/utils/keywordMatcher';
import {
  analyzeTraitForEffect,
  getTraitConditionLabel,
} from '@/services/game/traitConditionService';
import { hasTraitEffect } from '@/services/game/traitEffectService';

const REQUIRED_EFFECTS: { effectType: SkillEffectType; label: string }[] = [
  { effectType: asSkillEffectType('HEART_CAPTURE'), label: 'ハートキャプチャ' },
  { effectType: asSkillEffectType('HEART_BOOST'), label: 'ハートブースト' },
  { effectType: asSkillEffectType('WIDE_HEART'), label: 'ワイドハート' },
  { effectType: asSkillEffectType('WIDE_HEART_BOOST'), label: 'ワイドブースト' },
  { effectType: asSkillEffectType('LOVE_ATTRACT'), label: 'ラブアトラクト' },
  { effectType: asSkillEffectType('ATTRACT_BOOST'), label: 'アトラクトブースト' },
  { effectType: asSkillEffectType('VOLTAGE_GAIN'), label: 'ボルテージゲイン' },
  { effectType: asSkillEffectType('VOLTAGE_BOOST'), label: 'ボルテージブースト' },
  { effectType: asSkillEffectType('MENTAL_RECOVER'), label: 'メンタルリカバー' },
  { effectType: asSkillEffectType('MENTAL_PROTECT'), label: 'メンタルプロテクト' },
  { effectType: asSkillEffectType('EXTEND_HAND'), label: 'エクステンドハンド' },
  { effectType: asSkillEffectType('RESHUFFLE'), label: 'リシャッフル' },
];

export function analyzeDeck(
  deck: Deck | null,
  traitAnalysisMap?: Map<string, CardTraitAnalysisData>
): DeckAnalysis | null {
  if (!deck) return null;

  const cards = deck.slots.filter(slot => slot.card).map(slot => slot.card as Card);

  const tokenCards: TokenCardInfo[] = [];
  cards.forEach(card => {
    card.tokens?.forEach((acc, index) => {
      tokenCards.push({ card, token: acc, tokenIndex: index });
    });
  });

  const unDrawCards = extractUnDrawCards(cards, traitAnalysisMap);
  const imitationCount = countImitationCards(cards);
  const instanceCount = countInstanceCards(cards);
  const unDrawCount = unDrawCards.length;
  const excludedCards = buildExcludedCards(cards, unDrawCards);
  const excludedCount = excludedCards.length;
  const globalExcludedIds = new Set(
    excludedCards
      .filter(item => item.reasons.some(reason => reason !== 'UN_DRAW'))
      .map(item => item.card.id)
  );
  const drawCount = cards.length - excludedCount;
  const unDrawCountBySection = countUnDrawBySection(unDrawCards, globalExcludedIds);
  const globalExcludedCount = globalExcludedIds.size;
  const drawCountBySection = {
    section1: cards.length - globalExcludedCount - unDrawCountBySection.section1,
    section2: cards.length - globalExcludedCount - unDrawCountBySection.section2,
    section3: cards.length - globalExcludedCount - unDrawCountBySection.section3,
    section4: cards.length - globalExcludedCount - unDrawCountBySection.section4,
    section5: cards.length - globalExcludedCount - unDrawCountBySection.section5,
    sectionFever: cards.length - globalExcludedCount - unDrawCountBySection.sectionFever,
  };

  return {
    totalSlots: deck.slots.length,
    assignedSlots: cards.length,
    unDrawCount,
    imitationCount,
    instanceCount,
    drawCount,
    drawCountBySection,
    requiredEffects: REQUIRED_EFFECTS.map(req =>
      analyzeRequiredEffect(cards, req.effectType, req.label)
    ),
    unDrawCards,
    excludedCards,
    tokenCards,
  };
}

function countImitationCards(cards: Card[]): number {
  return cards.filter(card => hasSkillEffect(card, 'IMITATION' as SkillEffectType)).length;
}

function countInstanceCards(cards: Card[]): number {
  return cards.filter(card => hasTraitEffect(card, 'INSTANCE' as TraitEffectType)).length;
}

function buildExcludedCards(cards: Card[], unDrawCards: UnDrawCardInfo[]): ExcludedCardInfo[] {
  const reasonMap = new Map<string, { card: Card; reasons: Set<ExcludedReason> }>();

  const ensureEntry = (card: Card) => {
    if (!reasonMap.has(card.id)) {
      reasonMap.set(card.id, { card, reasons: new Set<ExcludedReason>() });
    }
    return reasonMap.get(card.id)!;
  };

  cards.forEach(card => {
    ensureEntry(card);
    if (hasSkillEffect(card, 'IMITATION' as SkillEffectType)) {
      ensureEntry(card).reasons.add('IMITATION');
    }
    if (hasTraitEffect(card, 'INSTANCE' as TraitEffectType)) {
      ensureEntry(card).reasons.add('INSTANCE');
    }
  });

  unDrawCards.forEach(info => {
    ensureEntry(info.card).reasons.add('UN_DRAW');
  });

  return Array.from(reasonMap.values())
    .filter(entry => entry.reasons.size > 0)
    .map(entry => ({
      card: entry.card,
      reasons: Array.from(entry.reasons),
    }));
}

function countUnDrawBySection(unDrawCards: UnDrawCardInfo[], globalExcludedIds: Set<string>) {
  const counts = {
    section1: 0,
    section2: 0,
    section3: 0,
    section4: 0,
    section5: 0,
    sectionFever: 0,
  };

  unDrawCards.forEach(info => {
    if (globalExcludedIds.has(info.card.id)) return;
    const { sections } = info;

    if (sections) {
      if (sections.section1) counts.section1++;
      if (sections.section2) counts.section2++;
      if (sections.section3) counts.section3++;
      if (sections.section4) counts.section4++;
      if (sections.section5) counts.section5++;
      if (sections.sectionFever) counts.sectionFever++;
      return;
    }
  });

  return counts;
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

  cards.forEach(card => {
    if (card.skill?.effect) {
      if (matchesKeywords(card.skill.effect, keywords)) {
        const effectText = findMatchedSentence(card.skill.effect, keywords);
        const key = `${card.id}-skill-main`;
        if (!matchedSkillKeys.has(key)) {
          skillMatches.push({
            card,
            source: 'skill',
            isToken: false,
            effectText,
          });
          matchedSkillKeys.add(key);
        }
        uniqueCardIds.add(card.id);
      }
    }

    card.tokens?.forEach((acc, index) => {
      if (acc.effect && matchesKeywords(acc.effect, keywords)) {
        const effectText = findMatchedSentence(acc.effect, keywords);
        const key = `${card.id}-skill-acc-${index}`;
        if (!matchedSkillKeys.has(key)) {
          skillMatches.push({
            card,
            source: 'skill',
            isToken: true,
            tokenIndex: index,
            effectText,
          });
          matchedSkillKeys.add(key);
        }
        uniqueCardIds.add(card.id);
      }
    });

    if (card.trait?.effect) {
      const traitResults = analyzeTraitForEffect(card.trait.effect, effectType);
      traitResults.forEach(result => {
        const traitMatch: DetectedTraitEffect = {
          card,
          source: 'trait',
          isToken: false,
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

    card.tokens?.forEach((acc, index) => {
      if (!acc.traitEffect) return;

      const traitResults = analyzeTraitForEffect(acc.traitEffect, effectType);
      traitResults.forEach(result => {
        const traitMatch: DetectedTraitEffect = {
          card,
          source: 'trait',
          isToken: true,
          tokenIndex: index,
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

  const traitMatches = Array.from(traitMatchesMap.entries()).map(([condition, items]) => ({
    condition,
    conditionLabel: getTraitConditionLabel(condition),
    items,
  }));

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

function findMatchedSentence(text: string, keywords: string[]): string | undefined {
  const sentences = text
    .split('。')
    .map(sentence => sentence.trim())
    .filter(sentence => sentence.length > 0);

  return sentences.find(sentence => matchesKeywords(sentence, keywords)) ?? sentences[0];
}

/**
 * アンドロー特性を持つカードを抽出
 */
function extractUnDrawCards(
  cards: Card[],
  traitAnalysisMap?: Map<string, CardTraitAnalysisData>
): UnDrawCardInfo[] {
  if (!traitAnalysisMap) {
    return [];
  }

  const unDrawCards: UnDrawCardInfo[] = [];

  cards.forEach(card => {
    const analysis = traitAnalysisMap.get(card.id);
    if (!analysis) return;

    // カード本体のアンドロー特性
    if (analysis.unDraw) {
      unDrawCards.push({
        card,
        isToken: false,
        sections: analysis.unDraw.sections,
        conditionDetail: null,
      });
    }
  });

  return unDrawCards;
}
