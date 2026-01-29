'use client';

import React from 'react';
import type {
  DetectedSkillEffect,
  DetectedTraitEffect,
} from '@/models/deck/DeckAnalysis';

interface DeckAnalyzerCardItemProps {
  match: DetectedSkillEffect | DetectedTraitEffect;
  showCondition?: boolean;
}

export const DeckAnalyzerCardItem: React.FC<DeckAnalyzerCardItemProps> = ({
  match,
  showCondition = false,
}) => {
  const isTraitMatch = match.source === 'trait';
  const traitMatch = isTraitMatch ? (match as DetectedTraitEffect) : null;

  return (
    <div className="flex items-start gap-3 p-2 bg-gray-50 rounded-lg">
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm text-gray-800 truncate">
          {match.card.cardName}
          {match.isAccessory && (
            <span className="ml-1 text-xs text-orange-600">(トークン)</span>
          )}
        </p>

        <p className="text-xs text-gray-500">{match.card.characterName}</p>

        {showCondition && traitMatch && (
          <p className="text-xs text-gray-600 mt-1 line-clamp-2">
            {traitMatch.effectText}
          </p>
        )}
      </div>
    </div>
  );
};
