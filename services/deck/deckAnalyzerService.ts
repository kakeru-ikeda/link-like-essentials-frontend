import type { Card } from '@/models/card/Card';
import type { Deck } from '@/models/deck/Deck';
import type {
  AccessoryCardInfo,
  DeckAnalysis,
  DetectedSkillEffect,
  DetectedTraitEffect,
  ExcludedCardInfo,
  ExcludedReason,
  RequiredEffectAnalysis,
  UnDrawCardInfo,
} from '@/models/deck/DeckAnalysis';
import type { CardTraitAnalysisData } from '@/models/card/TraitAnalysis';
import { SkillEffectType, TraitConditionType, TraitEffectType } from '@/models/shared/enums';
import {
  getSkillEffectKeyword,
  hasSkillEffect,
} from '@/services/game/skillEffectService';
import {
  analyzeTraitForEffect,
  getTraitConditionLabel,
} from '@/services/game/traitConditionService';
import { hasTraitEffect } from '@/services/game/traitEffectService';

const REQUIRED_EFFECTS: { effectType: SkillEffectType; label: string }[] = [
  { effectType: SkillEffectType.HEART_CAPTURE, label: 'ハートキャプチャ' },
  { effectType: SkillEffectType.HEART_BOOST, label: 'ハートブースト' },
  { effectType: SkillEffectType.WIDE_HEART, label: 'ワイドハート' },
  { effectType: SkillEffectType.WIDE_HEART_BOOST, label: 'ワイドブースト' },
  { effectType: SkillEffectType.LOVE_ATTRACT, label: 'ラブアトラクト' },
  { effectType: SkillEffectType.ATTRACT_BOOST, label: 'アトラクトブースト' },
  { effectType: SkillEffectType.VOLTAGE_GAIN, label: 'ボルテージゲイン' },
  { effectType: SkillEffectType.VOLTAGE_BOOST, label: 'ボルテージブースト' },
  { effectType: SkillEffectType.MENTAL_RECOVER, label: 'メンタルリカバー' },
  { effectType: SkillEffectType.MENTAL_PROTECT, label: 'メンタルプロテクト' },
  { effectType: SkillEffectType.EXTEND_HAND, label: 'エクステンドハンド' },
  { effectType: SkillEffectType.RESHUFFLE, label: 'リシャッフル' },
];

export function analyzeDeck(
  deck: Deck | null,
  traitAnalysisMap?: Map<string, CardTraitAnalysisData>
): DeckAnalysis | null {
  if (!deck) return null;

  const cards = deck.slots
    .filter((slot) => slot.card)
    .map((slot) => slot.card as Card);

  const accessoryCards: AccessoryCardInfo[] = [];
  cards.forEach((card) => {
    card.accessories?.forEach((acc, index) => {
      accessoryCards.push({ card, accessory: acc, accessoryIndex: index });
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
      .filter((item) => item.reasons.some((reason) => reason !== 'UN_DRAW'))
      .map((item) => item.card.id)
  );
  const drawCount = cards.length - excludedCount;
  const unDrawCountBySection = countUnDrawBySection(
    unDrawCards,
    globalExcludedIds
  );
  const globalExcludedCount = globalExcludedIds.size;
  const drawCountBySection = {
    section1: cards.length - globalExcludedCount - unDrawCountBySection.section1,
    section2: cards.length - globalExcludedCount - unDrawCountBySection.section2,
    section3: cards.length - globalExcludedCount - unDrawCountBySection.section3,
    section4: cards.length - globalExcludedCount - unDrawCountBySection.section4,
    section5: cards.length - globalExcludedCount - unDrawCountBySection.section5,
    sectionFever:
      cards.length - globalExcludedCount - unDrawCountBySection.sectionFever,
  };

  return {
    totalSlots: deck.slots.length,
    assignedSlots: cards.length,
    unDrawCount,
    imitationCount,
    instanceCount,
    drawCount,
    drawCountBySection,
    requiredEffects: REQUIRED_EFFECTS.map((req) =>
      analyzeRequiredEffect(cards, req.effectType, req.label)
    ),
    unDrawCards,
    excludedCards,
    accessoryCards,
  };
}

function countImitationCards(cards: Card[]): number {
  return cards.filter((card) => hasSkillEffect(card, SkillEffectType.IMITATION)).length;
}

function countInstanceCards(cards: Card[]): number {
  return cards.filter((card) => hasTraitEffect(card, TraitEffectType.INSTANCE)).length;
}

function buildExcludedCards(
  cards: Card[],
  unDrawCards: UnDrawCardInfo[]
): ExcludedCardInfo[] {
  const reasonMap = new Map<string, { card: Card; reasons: Set<ExcludedReason> }>();

  const ensureEntry = (card: Card) => {
    if (!reasonMap.has(card.id)) {
      reasonMap.set(card.id, { card, reasons: new Set<ExcludedReason>() });
    }
    return reasonMap.get(card.id)!;
  };

  cards.forEach((card) => {
    ensureEntry(card);
    if (hasSkillEffect(card, SkillEffectType.IMITATION)) {
      ensureEntry(card).reasons.add('IMITATION');
    }
    if (hasTraitEffect(card, TraitEffectType.INSTANCE)) {
      ensureEntry(card).reasons.add('INSTANCE');
    }
  });

  unDrawCards.forEach((info) => {
    ensureEntry(info.card).reasons.add('UN_DRAW');
  });

  return Array.from(reasonMap.values())
    .filter((entry) => entry.reasons.size > 0)
    .map((entry) => ({
      card: entry.card,
      reasons: Array.from(entry.reasons),
    }));
}

function countUnDrawBySection(
  unDrawCards: UnDrawCardInfo[],
  globalExcludedIds: Set<string>
) {
  const counts = {
    section1: 0,
    section2: 0,
    section3: 0,
    section4: 0,
    section5: 0,
    sectionFever: 0,
  };

  unDrawCards.forEach((info) => {
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

  cards.forEach((card) => {
    const analysis = traitAnalysisMap.get(card.id);
    if (!analysis) return;

    // カード本体のアンドロー特性
    if (analysis.unDraw) {
      unDrawCards.push({
        card,
        isAccessory: false,
        sections: analysis.unDraw.sections,
        conditionDetail: null,
      });
    }
  });

  return unDrawCards;
}
