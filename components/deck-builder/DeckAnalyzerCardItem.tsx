'use client';

import React from 'react';
import type {
  DetectedSkillEffect,
  DetectedTraitEffect,
} from '@/models/deck/DeckAnalysis';
import { TraitConditionType, TraitEffectType, SkillEffectType } from '@/models/shared/enums';
import { HighlightText } from '@/components/common/HighlightText';
import { CHARACTER_COLORS } from '@/styles/colors';
import { hasTraitEffect } from '@/services/game/traitEffectService';
import { hasSkillEffect } from '@/services/game/skillEffectService';

interface DeckAnalyzerCardItemProps {
  match: DetectedSkillEffect | DetectedTraitEffect;
  keywords: string[];
  showCondition?: boolean;
  dense?: boolean;
}

export const DeckAnalyzerCardItem: React.FC<DeckAnalyzerCardItemProps> = ({
  match,
  keywords,
  showCondition = false,
  dense = false,
}) => {
  const isTraitMatch = match.source === 'trait';
  const traitMatch = isTraitMatch ? (match as DetectedTraitEffect) : null;
  const skillMatch = !isTraitMatch ? (match as DetectedSkillEffect) : null;
  const tokenName = match.isAccessory
    ? match.card.accessories?.[match.accessoryIndex ?? -1]?.name
    : undefined;
  const characterColor = CHARACTER_COLORS[match.card.characterName] ?? '#9ca3af';
  const highlightKeywords = traitMatch?.condition
    ? buildConditionInclusiveKeywords(keywords, traitMatch.conditionText)
    : keywords;
  const highlightClassName = traitMatch?.condition
    ? getConditionHighlightClassName(traitMatch.condition)
    : undefined;

  // アンドロー特性の判定
  const hasUnDrawTrait = hasTraitEffect(match.card, TraitEffectType.UN_DRAW);
  // イミテーションスキルの判定
  const hasImitationSkill = hasSkillEffect(match.card, SkillEffectType.IMITATION);

  return (
    <div
      className={`flex items-start gap-3 rounded-lg bg-gray-50 border-l-4 ${
        dense ? 'px-2 py-1.5' : 'p-2'
      }`}
      style={{ borderLeftColor: characterColor }}
    >
      <div className="flex-1 min-w-0">
        <p
          className={`font-medium text-gray-800 truncate ${
            dense ? 'text-xs' : 'text-sm'
          }`}
        >
          {match.card.cardName}
          {match.isAccessory && (
            <span
              className={`ml-1 text-orange-600 ${
                dense ? 'text-[10px]' : 'text-xs'
              }`}
            >
              ({tokenName ? `${tokenName}` : 'トークン'})
            </span>
          )}
          {hasUnDrawTrait && (
            <span
              className={`ml-1 bg-gray-200 text-gray-800 px-1 rounded ${
                dense ? 'text-[10px]' : 'text-xs'
              }`}
            >
              ⚠アンドロー
            </span>
          )}
          {hasImitationSkill && (
            <span
              className={`ml-1 bg-gray-200 text-gray-800 px-1 rounded ${
                dense ? 'text-[10px]' : 'text-xs'
              }`}
            >
              ⚠イミテーション
            </span>
          )}
        </p>

        <p className={`text-gray-500 ${dense ? 'text-[10px]' : 'text-xs'}`}>
          {match.card.characterName}
        </p>

        {showCondition && traitMatch && (
          <p
            className={`text-gray-600 ${
              dense ? 'text-[10px] mt-0.5' : 'text-xs mt-1'
            }`}
          >
            <HighlightText
              text={traitMatch.effectText}
              keywords={highlightKeywords}
              highlightClassName={highlightClassName}
            />
          </p>
        )}
        {showCondition && skillMatch?.effectText && (
          <p
            className={`text-gray-600 ${
              dense ? 'text-[10px] mt-0.5' : 'text-xs mt-1'
            }`}
          >
            <HighlightText text={skillMatch.effectText} keywords={keywords} />
          </p>
        )}
      </div>
    </div>
  );
};

const escapeRegExp = (value: string): string =>
  value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const buildConditionInclusiveKeywords = (
  keywords: string[],
  conditionText: string
): string[] => {
  if (!conditionText) return keywords;

  const escapedCondition = escapeRegExp(conditionText);
  const conditionPatterns = keywords.map((keyword) => {
    const effectPattern = keyword.includes('\\')
      ? keyword
      : escapeRegExp(keyword);
    return `${escapedCondition}[\\s\\S]*?${effectPattern}`;
  });

  return conditionPatterns;
};

const getConditionHighlightClassName = (
  condition: TraitConditionType
): string => {
  switch (condition) {
    case TraitConditionType.DRAW:
      return 'bg-sky-200 text-sky-950 font-semibold px-0.5 rounded';
    case TraitConditionType.HEART_COLLECT:
      return 'bg-rose-200 text-rose-950 font-semibold px-0.5 rounded';
    case TraitConditionType.NONE:
      return 'bg-emerald-200 text-emerald-950 font-semibold px-0.5 rounded';
    default:
      return 'bg-emerald-200 text-emerald-950 font-semibold px-0.5 rounded';
  }
};
