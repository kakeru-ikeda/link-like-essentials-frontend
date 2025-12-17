'use client';

import React from 'react';
import { Card } from '@/models/Card';
import { Tooltip } from '@/components/common/Tooltip';
import { getCharacterBackgroundColor } from '@/constants/characters';

interface LRCardBadgeProps {
  card: Card;
}

/**
 * LRカードバッジコンポーネント
 * ツールチップでスペシャルアピール情報を表示
 */
export const LRCardBadge: React.FC<LRCardBadgeProps> = ({ card }) => {
  const tooltipContent = card.detail?.specialAppeal ? (
    <div className="space-y-2 min-w-[200px]">
      <div className="text-sm font-medium text-white">
        {card.cardName} - {card.characterName}
      </div>
      <div
        className="rounded p-2 space-y-1"
        style={{ backgroundColor: getCharacterBackgroundColor(card.characterName, 0.6) }}
      >
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-white">
            {card.detail.specialAppeal.name}
          </span>
          {card.detail.specialAppeal.ap && (
            <span className="px-1.5 py-0.5 bg-blue-600 text-white text-xs font-semibold rounded">
              AP {card.detail.specialAppeal.ap}
            </span>
          )}
        </div>
        {card.detail.specialAppeal.effect && (
          <p className="text-xs text-gray-200 whitespace-pre-line">
            {card.detail.specialAppeal.effect}
          </p>
        )}
      </div>
    </div>
  ) : (
    card.cardName
  );

  return (
    <Tooltip content={tooltipContent} position="top">
      <div
        className="px-2 py-1 rounded text-xs font-medium cursor-help border-1"
        style={{
          backgroundColor: getCharacterBackgroundColor(card.characterName, 0.3),
          borderColor: getCharacterBackgroundColor(card.characterName, 0.6),
          color: '#374151',
        }}
      >
        {card.cardName}
      </div>
    </Tooltip>
  );
};
