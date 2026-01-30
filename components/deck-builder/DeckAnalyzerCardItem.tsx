'use client';

import React from 'react';
import type {
  DetectedSkillEffect,
  DetectedTraitEffect,
} from '@/models/deck/DeckAnalysis';
import { HighlightText } from '@/components/common/HighlightText';

interface DeckAnalyzerCardItemProps {
  match: DetectedSkillEffect | DetectedTraitEffect;
  keywords: string[];
  showCondition?: boolean;
}

export const DeckAnalyzerCardItem: React.FC<DeckAnalyzerCardItemProps> = ({
  match,
  keywords,
  showCondition = false,
}) => {
  const isTraitMatch = match.source === 'trait';
  const traitMatch = isTraitMatch ? (match as DetectedTraitEffect) : null;
  const skillMatch = !isTraitMatch ? (match as DetectedSkillEffect) : null;
  const tokenName = match.isAccessory
    ? match.card.accessories?.[match.accessoryIndex ?? -1]?.name
    : undefined;

  return (
    <div className="flex items-start gap-3 p-2 bg-gray-50 rounded-lg">
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm text-gray-800 truncate">
          {match.card.cardName}
          {match.isAccessory && (
            <span className="ml-1 text-xs text-orange-600">
              ({tokenName ? `${tokenName}` : 'トークン'})
            </span>
          )}
        </p>

        <p className="text-xs text-gray-500">{match.card.characterName}</p>

        {showCondition && traitMatch && (
          <p className="text-xs text-gray-600 mt-1 line-clamp-2">
            <HighlightText text={traitMatch.effectText} keywords={keywords} />
          </p>
        )}
        {showCondition && skillMatch?.effectText && (
          <p className="text-xs text-gray-600 mt-1 line-clamp-2">
            <HighlightText text={skillMatch.effectText} keywords={keywords} />
          </p>
        )}
      </div>
    </div>
  );
};
